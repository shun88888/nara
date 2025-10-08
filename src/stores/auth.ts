import { create } from 'zustand';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentSession,
  resetPassword as resetPasswordAPI,
  updatePassword as updatePasswordAPI,
  type AuthUser,
} from '../services/auth';
import { getProfile, upsertProfile } from '../services/api';
import type { Database } from '../types/database.types';

type Role = Database['public']['Enums']['user_role'];
type Profile = Database['public']['Tables']['profiles']['Row'];

type Session = { userId: string; email: string; role: Role } | null;

type AuthState = {
  session: Session;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role?: Role) => Promise<void>;
  signout: () => Promise<void>;
  loadSession: () => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  loading: false,
  error: null,
  initialized: false,

  signin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const authUser = await signInWithEmail(email, password);
      const session: Session = {
        userId: authUser.userId,
        email: authUser.email,
        role: authUser.role,
      };
      set({ session, error: null });

      // Load profile after successful signin
      await get().loadProfile(authUser.userId);
      set({ loading: false });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to sign in', loading: false });
      throw e;
    }
  },

  signup: async (email, password, role = 'user') => {
    set({ loading: true, error: null });
    try {
      const authUser = await signUpWithEmail(email, password, role);
      const session: Session = {
        userId: authUser.userId,
        email: authUser.email,
        role: authUser.role,
      };
      set({ session, loading: false });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to sign up', loading: false });
      throw e;
    }
  },

  signout: async () => {
    try {
      await signOut();
      set({ session: null, profile: null, error: null });
    } catch (e: any) {
      console.error('Sign out error:', e);
      // Clear local state even if API call fails
      set({ session: null, profile: null });
    }
  },

  loadSession: async () => {
    set({ loading: true });
    try {
      const sessionData = await getCurrentSession();
      if (sessionData) {
        const session: Session = {
          userId: sessionData.userId,
          email: sessionData.email,
          role: sessionData.role,
        };
        set({ session });
        await get().loadProfile(sessionData.userId);
      }
      set({ loading: false, initialized: true });
    } catch (error: any) {
      console.error('Failed to load session:', error);
      set({ loading: false, initialized: true });
    }
  },

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

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await resetPasswordAPI(email);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePassword: async (newPassword) => {
    set({ loading: true, error: null });
    try {
      await updatePasswordAPI(newPassword);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));


