import { create } from 'zustand';
import {
  getProviderByUserId,
  createProvider as createProviderAPI,
  updateProvider as updateProviderAPI,
} from '../services/api/providers';
import {
  getProviderBookings,
  type BookingWithExperience,
} from '../services/api/bookings';
import {
  getProviderExperiences,
  createExperience as createExperienceAPI,
  updateExperience as updateExperienceAPI,
  deleteExperience as deleteExperienceAPI,
} from '../services/api/experiences';
import type { Database } from '../types/database.types';

type Provider = Database['public']['Tables']['providers']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];
type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];

export type ProviderTodayItem = {
  id: string;
  childName: string;
  age: number;
  experienceTitle: string;
  startAt: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'checked_in' | 'completed';
};

type ProviderState = {
  provider: Provider | null;
  experiences: Experience[];
  bookings: BookingWithExperience[];
  todayBookings: ProviderTodayItem[];
  loading: boolean;
  error: string | null;

  // Provider management
  loadProvider: (userId: string) => Promise<void>;
  createProvider: (userId: string, data: Omit<Database['public']['Tables']['providers']['Insert'], 'user_id'>) => Promise<void>;
  updateProvider: (providerId: string, updates: Partial<Provider>) => Promise<void>;

  // Experience management
  loadExperiences: (providerId: string) => Promise<void>;
  createExperience: (experience: ExperienceInsert) => Promise<void>;
  updateExperience: (id: string, updates: Partial<ExperienceInsert>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  // Booking management
  loadBookings: (providerId: string) => Promise<void>;
  loadTodayBookings: (providerId: string) => Promise<void>;
  checkIn: (bookingId: string) => void;
};

export const useProviderStore = create<ProviderState>((set, get) => ({
  provider: null,
  experiences: [],
  bookings: [],
  todayBookings: [],
  loading: false,
  error: null,

  loadProvider: async (userId) => {
    set({ loading: true, error: null });
    try {
      const provider = await getProviderByUserId(userId);
      set({ provider, loading: false });
    } catch (error: any) {
      console.error('Failed to load provider:', error);
      set({ error: error.message, loading: false });
    }
  },

  createProvider: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const provider = await createProviderAPI({ ...data, user_id: userId });
      set({ provider, loading: false });
    } catch (error: any) {
      console.error('Failed to create provider:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProvider: async (providerId, updates) => {
    set({ loading: true, error: null });
    try {
      const provider = await updateProviderAPI(providerId, updates);
      set({ provider, loading: false });
    } catch (error: any) {
      console.error('Failed to update provider:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loadExperiences: async (providerId) => {
    set({ loading: true, error: null });
    try {
      const experiences = await getProviderExperiences(providerId);
      set({ experiences, loading: false });
    } catch (error: any) {
      console.error('Failed to load experiences:', error);
      set({ error: error.message, loading: false });
    }
  },

  createExperience: async (experience) => {
    set({ loading: true, error: null });
    try {
      const newExperience = await createExperienceAPI(experience);
      set((state) => ({
        experiences: [newExperience, ...state.experiences],
        loading: false,
      }));
    } catch (error: any) {
      console.error('Failed to create experience:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateExperience: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateExperienceAPI(id, updates);
      set((state) => ({
        experiences: state.experiences.map((exp) => (exp.id === id ? updated : exp)),
        loading: false,
      }));
    } catch (error: any) {
      console.error('Failed to update experience:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteExperience: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteExperienceAPI(id);
      set((state) => ({
        experiences: state.experiences.filter((exp) => exp.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      console.error('Failed to delete experience:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loadBookings: async (providerId) => {
    set({ loading: true, error: null });
    try {
      const bookings = await getProviderBookings(providerId);
      set({ bookings, loading: false });
    } catch (error: any) {
      console.error('Failed to load bookings:', error);
      set({ error: error.message, loading: false });
    }
  },

  loadTodayBookings: async (providerId) => {
    try {
      const bookings = await getProviderBookings(providerId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayBookings: ProviderTodayItem[] = bookings
        .filter((booking) => {
          const startAt = new Date(booking.start_at);
          return startAt >= today && startAt < tomorrow;
        })
        .map((booking) => ({
          id: booking.id,
          childName: booking.child_name,
          age: booking.child_age,
          experienceTitle: booking.experienceTitle,
          startAt: booking.start_at,
          status: booking.status,
        }));

      set({ todayBookings });
    } catch (error: any) {
      console.error('Failed to load today bookings:', error);
    }
  },

  checkIn: (bookingId) =>
    set((state) => ({
      todayBookings: state.todayBookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'checked_in' as const } : b
      ),
    })),
}));


