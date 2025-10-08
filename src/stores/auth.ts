import { create } from 'zustand';
import { signInWithEmail, signOut } from '../services/auth';
import { getProfile, upsertProfile } from '../services/api';
import type { Database } from '../types/database.types';

type Role = 'user' | 'provider' | null;
type Profile = Database['public']['Tables']['profiles']['Row'];

type Session = { userId: string; email: string } | null;

type AuthState = {
  session: Session;
  role: Role;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  setRole: (role: Exclude<Role, null>) => void;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  role: null,
  profile: null,
  loading: false,
  error: null,

  signin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await signInWithEmail(email, password);
      const session = { userId: res.userId, email: res.email };
      set({ session, error: null });

      // Load profile after successful signin
      await get().loadProfile(res.userId);
      set({ loading: false });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to sign in', loading: false });
    }
  },

  signout: async () => {
    await signOut();
    set({ session: null, role: null, profile: null });
  },

  setRole: (role) => set({ role }),

  loadProfile: async (userId) => {
    try {
      const profile = await getProfile(userId);
      set({ profile });
    } catch (error: any) {
      console.error('Failed to load profile:', error);
    }
  },

  updateProfile: async (userId, updates) => {
    set({ loading: true, error: null });
    try {
      const profile = await upsertProfile(userId, updates);
      set({ profile, loading: false });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));


