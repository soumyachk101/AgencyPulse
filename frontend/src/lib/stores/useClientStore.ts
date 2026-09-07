import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Client } from '@/lib/types/client';

interface ClientState {
 clients: Client[];
 selectedClientId: string | null;
 isLoading: boolean;
 error: string | null;
 setClients: (clients: Client[]) => void;
 addClient: (client: Client) => void;
 updateClient: (id: string, updates: Partial<Client>) => void;
 deleteClient: (id: string) => void;
 selectClient: (id: string | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 reset: () => void;
}

const initialState = {
 clients: [],
 selectedClientId: null,
 isLoading: false,
 error: null,
};

export const useClientStore = create<ClientState>()(
 persist(
 (set) => ({
 ...initialState,
 setClients: (clients) => set({ clients }),
 addClient: (client) =>
 set((state) => ({ clients: [...state.clients, client] })),
 updateClient: (id, updates) =>
 set((state) => ({
 clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
 })),
 deleteClient: (id) =>
 set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),
 selectClient: (id) => set({ selectedClientId: id }),
 setLoading: (isLoading) => set({ isLoading }),
 setError: (error) => set({ error }),
 reset: () => set(initialState),
 }),
 { name: 'client-storage', partialize: (state) => ({ clients: state.clients }) }
 )
);
