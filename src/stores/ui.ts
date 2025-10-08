import { create } from 'zustand';

type Toast = { type: 'success' | 'error'; msg: string } | null;

type UIState = {
  toast: Toast;
  network: 'online' | 'offline';
  setToast: (t: Toast) => void;
  setNetwork: (n: 'online' | 'offline') => void;
};

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  network: 'online',
  setToast: (toast) => set({ toast }),
  setNetwork: (network) => set({ network }),
}));


