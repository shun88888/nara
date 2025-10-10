import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FILTER_STORAGE_KEY = '@kikkake_filters';

export type FilterState = {
  // Active filters
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
  targetAges: string[];
  durations: string[];
  minRating: number | null;
  onlyAvailable: boolean;

  // Actions
  setCategories: (categories: string[]) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setTargetAges: (ages: string[]) => void;
  setDurations: (durations: string[]) => void;
  setMinRating: (rating: number | null) => void;
  setOnlyAvailable: (onlyAvailable: boolean) => void;
  clearFilters: () => void;
  loadFiltersFromStorage: () => Promise<void>;
  saveFiltersToStorage: () => Promise<void>;
  hasActiveFilters: () => boolean;
};

const initialState = {
  categories: [],
  minPrice: null,
  maxPrice: null,
  targetAges: [],
  durations: [],
  minRating: null,
  onlyAvailable: false,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,

  setCategories: (categories) => {
    set({ categories });
    get().saveFiltersToStorage();
  },

  setPriceRange: (minPrice, maxPrice) => {
    set({ minPrice, maxPrice });
    get().saveFiltersToStorage();
  },

  setTargetAges: (targetAges) => {
    set({ targetAges });
    get().saveFiltersToStorage();
  },

  setDurations: (durations) => {
    set({ durations });
    get().saveFiltersToStorage();
  },

  setMinRating: (minRating) => {
    set({ minRating });
    get().saveFiltersToStorage();
  },

  setOnlyAvailable: (onlyAvailable) => {
    set({ onlyAvailable });
    get().saveFiltersToStorage();
  },

  clearFilters: () => {
    set(initialState);
    get().saveFiltersToStorage();
  },

  loadFiltersFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
      if (stored) {
        const filters = JSON.parse(stored);
        set(filters);
      }
    } catch (error) {
      console.error('Failed to load filters from storage:', error);
    }
  },

  saveFiltersToStorage: async () => {
    try {
      const state = get();
      const filters = {
        categories: state.categories,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        targetAges: state.targetAges,
        durations: state.durations,
        minRating: state.minRating,
        onlyAvailable: state.onlyAvailable,
      };
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save filters to storage:', error);
    }
  },

  hasActiveFilters: () => {
    const state = get();
    return (
      state.categories.length > 0 ||
      state.minPrice !== null ||
      state.maxPrice !== null ||
      state.targetAges.length > 0 ||
      state.durations.length > 0 ||
      state.minRating !== null ||
      state.onlyAvailable
    );
  },
}));
