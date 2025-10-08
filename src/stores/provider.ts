import { create } from 'zustand';

type ProviderTodayItem = {
  id: string;
  childName: string;
  age: number;
  experienceTitle: string;
  startAt: string;
  status: 'confirmed' | 'checked_in';
};

type Slot = {
  id: string;
  startAt: string;
  endAt: string;
  capacity: number;
  available: number;
  visibility: 'public' | 'draft';
};

type ProviderState = {
  today: ProviderTodayItem[];
  slots: Slot[];
  checkIn: (bookingId: string) => void;
  createSlot: () => void;
  updateSlot: (id: string, patch: Partial<Slot>) => void;
  isOverlap: (startAt: string, endAt: string, ignoreId?: string) => boolean;
};

const now = new Date();

export const useProviderStore = create<ProviderState>((set) => ({
  today: [
    {
      id: 't1',
      childName: 'タロウ',
      age: 8,
      experienceTitle: '1日ロボット教室 体験',
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0).toISOString(),
      status: 'confirmed',
    },
  ],
  slots: [
    {
      id: 's1',
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0, 0).toISOString(),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0, 0).toISOString(),
      capacity: 10,
      available: 5,
      visibility: 'public',
    },
  ],
  checkIn: (bookingId) => set((s) => ({
    today: s.today.map(b => b.id === bookingId ? { ...b, status: 'checked_in' } : b),
  })),
  createSlot: () => set((s) => ({
    slots: [
      {
        id: 's_' + Math.random().toString(36).slice(2),
        startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0, 0).toISOString(),
        endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0, 0).toISOString(),
        capacity: 10,
        available: 10,
        visibility: 'draft',
      },
      ...s.slots,
    ],
  })),
  updateSlot: (id, patch) => set((s) => ({
    slots: s.slots.map(slot => slot.id === id ? { ...slot, ...patch } : slot),
  })),
  isOverlap: (startAt, endAt, ignoreId) => {
    const sTs = new Date(startAt).getTime();
    const eTs = new Date(endAt).getTime();
    if (eTs <= sTs) return true;
    const state = (get as any)();
    return state.slots.some((slot: Slot) => {
      if (ignoreId && slot.id === ignoreId) return false;
      const a = new Date(slot.startAt).getTime();
      const b = new Date(slot.endAt).getTime();
      return Math.max(a, sTs) < Math.min(b, eTs);
    });
  },
}));


