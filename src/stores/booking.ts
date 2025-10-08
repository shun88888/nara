import { create } from 'zustand';
import { generateQR } from '../lib/qr';

export type Booking = {
  id: string;
  experienceId: string;
  experienceTitle: string;
  startAt: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'checked_in';
  qrToken: string;
};

type BookingState = {
  upcoming: Booking[];
  past: Booking[];
  confirmBooking: () => Booking;
  getBooking: (id: string) => Booking | null;
  refreshQrToken: (id: string) => void;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  upcoming: [],
  past: [],
  confirmBooking: () => {
    const b: Booking = {
      id: 'b_' + Math.random().toString(36).slice(2),
      experienceId: 'exp_1',
      experienceTitle: '1日ロボット教室 体験',
      startAt: new Date().toISOString(),
      status: 'confirmed',
      qrToken: generateQR('b_' + Math.random().toString(36).slice(2)),
    };
    set((s) => ({ upcoming: [b, ...s.upcoming] }));
    return b;
  },
  getBooking: (id) => [...get().upcoming, ...get().past].find(b => b.id === id) ?? null,
  refreshQrToken: (id) => set((s) => ({
    upcoming: s.upcoming.map(b => b.id === id ? { ...b, qrToken: 'mock.qr.token.' + Date.now() } : b),
  })),
}));


