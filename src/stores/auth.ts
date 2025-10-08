import { create } from 'zustand';
import { signInWithEmail, signOut } from '../services/auth';

type Role = 'user' | 'provider' | null;

type Session = { userId: string; email: string } | null;

type AuthState = {
  session: Session;
  role: Role;
  error: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  setRole: (role: Exclude<Role, null>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  role: null,
  error: null,
  signin: async (email, password) => {
    try {
      const res = await signInWithEmail(email, password);
      set({ session: { userId: res.userId, email: res.email }, error: null });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to sign in' });
    }
  },
  signout: async () => {
    await signOut();
    set({ session: null, role: null });
  },
  setRole: (role) => set({ role }),
}));


