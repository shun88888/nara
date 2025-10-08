import { create } from 'zustand';

export type FavoriteExperience = {
  id: string;
  title: string;
  providerName: string;
  priceYen: number;
  photos: string[];
  targetAge: string;
  area: string;
  addedAt: string;
};

type FavoriteState = {
  favorites: FavoriteExperience[];
  loading: boolean;
  addFavorite: (experience: FavoriteExperience) => void;
  removeFavorite: (experienceId: string) => void;
  isFavorite: (experienceId: string) => boolean;
  clearFavorites: () => void;
};

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  loading: false,

  addFavorite: (experience) => {
    set((state) => {
      // Check if already exists
      if (state.favorites.find((f) => f.id === experience.id)) {
        return state;
      }

      return {
        favorites: [
          {
            ...experience,
            addedAt: new Date().toISOString(),
          },
          ...state.favorites,
        ],
      };
    });
  },

  removeFavorite: (experienceId) => {
    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== experienceId),
    }));
  },

  isFavorite: (experienceId) => {
    return get().favorites.some((f) => f.id === experienceId);
  },

  clearFavorites: () => {
    set({ favorites: [] });
  },
}));
