import { create } from 'zustand';

type AnalyticsState = {
  nsmWeeklyCheckins: number;
  track: (type: string, meta?: Record<string, any>) => void;
};

export const useAnalyticsStore = create<AnalyticsState>(() => ({
  nsmWeeklyCheckins: 12,
  track: () => {},
}));


