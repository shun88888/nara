import { create } from 'zustand';
import { getExperiences as fetchExperiencesAPI, getExperienceById as fetchExperienceByIdAPI } from '../services/api';

export type Experience = {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  targetAge: string;
  durationMin: number;
  priceYen: number;
  photos: string[];
  isPublished: boolean;
  category?: string | null;
};

type FetchParams = {
  area?: 'oimachi-line';
  onlyAvailable?: boolean;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

type ExperienceState = {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  fetchExperiences: (params?: FetchParams) => Promise<void>;
  getExperienceById: (id: string) => Promise<Experience | null>;
  getCachedExperienceById: (id: string) => Experience | null;
};

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  experiences: [],
  loading: false,
  error: null,

  fetchExperiences: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchExperiencesAPI(params);
      // Transform API data to match store format
      const experiences: Experience[] = data.map((exp) => ({
        id: exp.id,
        providerId: exp.provider_id,
        providerName: exp.providerName,
        title: exp.title,
        description: exp.description,
        targetAge: exp.target_age,
        durationMin: exp.duration_min,
        priceYen: exp.price_yen,
        photos: exp.photos || [],
        isPublished: exp.is_published,
        category: exp.category,
      }));
      set({ experiences, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch experiences:', error);
      set({ error: error.message, loading: false });
    }
  },

  getExperienceById: async (id) => {
    // Check cache first
    const cached = get().experiences.find((e) => e.id === id);
    if (cached) {
      return cached;
    }

    // Fetch from API
    try {
      const data = await fetchExperienceByIdAPI(id);
      if (!data) return null;

      const experience: Experience = {
        id: data.id,
        providerId: data.provider_id,
        providerName: data.providerName,
        title: data.title,
        description: data.description,
        targetAge: data.target_age,
        durationMin: data.duration_min,
        priceYen: data.price_yen,
        photos: data.photos || [],
        isPublished: data.is_published,
        category: data.category,
      };

      // Add to cache
      set((state) => ({
        experiences: [...state.experiences.filter((e) => e.id !== id), experience],
      }));

      return experience;
    } catch (error: any) {
      console.error('Failed to fetch experience:', error);
      return null;
    }
  },

  getCachedExperienceById: (id) => {
    return get().experiences.find((e) => e.id === id) ?? null;
  },
}));


