import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types/user';

interface AuthState {
 user: User | null;
 token: string | null;
 isAuthenticated: boolean;
 setAuth: (user: User, token: string) => void;
 logout: () => void;
 reset: () => void;
}

const initialState = {
 user: null,
 token: null,
 isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
 persist(
 (set) => ({
 ...initialState,
 setAuth: (user, token) => set({ user, token, isAuthenticated: !!token }),
 logout: () => set(initialState),
 reset: () => set(initialState),
 }),
 { name: 'auth-storage', partialize: (state) => ({ token: state.token, user: state.user }) }
 )
);
