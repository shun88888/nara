import { create } from 'zustand';
import {
  createBooking as createBookingAPI,
  getUserBookings,
  getUpcomingBookings,
  getPastBookings,
  getBookingById as fetchBookingByIdAPI,
  cancelBooking as cancelBookingAPI,
  refreshQRToken as refreshQRTokenAPI,
  type CreateBookingParams,
} from '../services/api';
import { useExperienceStore } from './experience';

export type Booking = {
  id: string;
  experienceId: string;
  experienceTitle: string;
  startAt: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'checked_in' | 'completed';
  qrToken: string;
  qrExpiresAt?: string | null;
  paymentMethod?: string;
  providerName?: string;
  childName?: string;
  guardianName?: string;
};

type BookingState = {
  upcoming: Booking[];
  past: Booking[];
  loading: boolean;
  error: string | null;
  confirmBooking: (params: CreateBookingParams) => Promise<Booking>;
  fetchBookings: (userId: string) => Promise<void>;
  fetchUpcoming: (userId: string) => Promise<void>;
  fetchPast: (userId: string) => Promise<void>;
  getBooking: (id: string) => Promise<Booking | null>;
  getCachedBooking: (id: string) => Booking | null;
  cancelBooking: (id: string) => Promise<void>;
  refreshQrToken: (id: string) => Promise<void>;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  upcoming: [],
  past: [],
  loading: false,
  error: null,

  confirmBooking: async (params) => {
    set({ loading: true, error: null });
    try {
      const booking = await createBookingAPI(params);

      // Enrich with experience title/provider immediately to avoid blank UI
      const expStore = useExperienceStore.getState();
      let experienceTitle = '';
      let providerName: string | undefined = undefined;
      const cachedExp = expStore.getCachedExperienceById(booking.experience_id);
      if (cachedExp) {
        experienceTitle = cachedExp.title;
        providerName = cachedExp.providerName;
      } else {
        try {
          const fetched = await expStore.getExperienceById(booking.experience_id);
          if (fetched) {
            experienceTitle = fetched.title;
            providerName = fetched.providerName;
          }
        } catch {}
      }

      // Transform to store format
      const storeBooking: Booking = {
        id: booking.id,
        experienceId: booking.experience_id,
        experienceTitle,
        startAt: booking.start_at,
        status: booking.status,
        qrToken: booking.qr_token,
        qrExpiresAt: booking.qr_expires_at,
        paymentMethod: booking.payment_method || undefined,
        childName: booking.child_name,
        guardianName: booking.guardian_name,
        providerName,
      };

      // Add to upcoming bookings
      set((state) => ({
        upcoming: [storeBooking, ...state.upcoming],
        loading: false,
      }));

      return storeBooking;
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchBookings: async (userId) => {
    set({ loading: true, error: null });
    try {
      const bookings = await getUserBookings(userId);
      const now = new Date();

      const upcoming: Booking[] = [];
      const past: Booking[] = [];

      bookings.forEach((booking) => {
        const storeBooking: Booking = {
          id: booking.id,
          experienceId: booking.experience_id,
          experienceTitle: booking.experienceTitle,
          startAt: booking.start_at,
          status: booking.status,
          qrToken: booking.qr_token,
          qrExpiresAt: booking.qr_expires_at,
          paymentMethod: booking.payment_method || undefined,
          providerName: booking.providerName,
          childName: booking.child_name,
          guardianName: booking.guardian_name,
        };

        if (new Date(booking.start_at) > now && booking.status !== 'canceled') {
          upcoming.push(storeBooking);
        } else {
          past.push(storeBooking);
        }
      });

      set({ upcoming, past, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchUpcoming: async (userId) => {
    try {
      const bookings = await getUpcomingBookings(userId);
      const upcoming: Booking[] = bookings.map((booking) => ({
        id: booking.id,
        experienceId: booking.experience_id,
        experienceTitle: booking.experienceTitle,
        startAt: booking.start_at,
        status: booking.status,
        qrToken: booking.qr_token,
        qrExpiresAt: booking.qr_expires_at,
        paymentMethod: booking.payment_method || undefined,
        providerName: booking.providerName,
        childName: booking.child_name,
        guardianName: booking.guardian_name,
      }));

      set({ upcoming });
    } catch (error: any) {
      console.error('Failed to fetch upcoming bookings:', error);
    }
  },

  fetchPast: async (userId) => {
    try {
      const bookings = await getPastBookings(userId);
      const past: Booking[] = bookings.map((booking) => ({
        id: booking.id,
        experienceId: booking.experience_id,
        experienceTitle: booking.experienceTitle,
        startAt: booking.start_at,
        status: booking.status,
        qrToken: booking.qr_token,
        qrExpiresAt: booking.qr_expires_at,
        paymentMethod: booking.payment_method || undefined,
        providerName: booking.providerName,
        childName: booking.child_name,
        guardianName: booking.guardian_name,
      }));

      set({ past });
    } catch (error: any) {
      console.error('Failed to fetch past bookings:', error);
    }
  },

  getBooking: async (id) => {
    // Check cache first
    const cached = get().getCachedBooking(id);
    if (cached) return cached;

    // Fetch from API
    try {
      const booking = await fetchBookingByIdAPI(id);
      if (!booking) return null;

      const storeBooking: Booking = {
        id: booking.id,
        experienceId: booking.experience_id,
        experienceTitle: '', // Would need to join with experience
        startAt: booking.start_at,
        status: booking.status,
        qrToken: booking.qr_token,
        qrExpiresAt: booking.qr_expires_at,
        paymentMethod: booking.payment_method || undefined,
        childName: booking.child_name,
        guardianName: booking.guardian_name,
      };

      return storeBooking;
    } catch (error: any) {
      console.error('Failed to fetch booking:', error);
      return null;
    }
  },

  getCachedBooking: (id) => {
    return [...get().upcoming, ...get().past].find((b) => b.id === id) ?? null;
  },

  cancelBooking: async (id) => {
    try {
      await cancelBookingAPI(id);

      // Update local state: move canceled item to past with updated status
      set((state) => {
        const target = state.upcoming.find((b) => b.id === id) || null;
        const updatedUpcoming = state.upcoming
          .map((b) => (b.id === id ? { ...b, status: 'canceled' as const } : b))
          .filter((b) => b.id !== id);
        const updatedPast = target
          ? [{ ...target, status: 'canceled' as const }, ...state.past]
          : state.past;
        return { upcoming: updatedUpcoming, past: updatedPast };
      });
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      throw error;
    }
  },

  refreshQrToken: async (id) => {
    try {
      const { qrToken, expiresAt } = await refreshQRTokenAPI(id);

      // Update local state
      set((state) => ({
        upcoming: state.upcoming.map((b) =>
          b.id === id ? { ...b, qrToken, qrExpiresAt: expiresAt } : b
        ),
      }));
    } catch (error: any) {
      console.error('Failed to refresh QR token:', error);
      throw error;
    }
  },
}));


