import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Organization, OrganizationSettings } from '@/lib/types/organization';

interface OrganizationState {
 organization: Organization | null;
 setOrganization: (org: Organization) => void;
 updateSettings: (settings: Partial<OrganizationSettings>) => void;
 reset: () => void;
}

const defaultOrg: Organization = {
 id: '',
 name: '',
 domain: '',
 plan: 'starter',
 status: 'active',
 createdAt: new Date(),
 settings: {
 timezone: 'UTC',
 dateFormat: 'MM/DD/YYYY',
 currency: 'USD',
 locale: 'en-US',
 branding: {
 primaryColor: '#8B5CF6',
 secondaryColor: '#64748B',
 accentColor: '#10B981',
 fontFamily: 'Inter',
 },
 },
 billing: {
 cancelAtPeriodEnd: false,
 },
};

export const useOrganizationStore = create<OrganizationState>()(
 persist(
 (set) => ({
 organization: null,
 setOrganization: (org) => set({ organization: org }),
 updateSettings: (settings) =>
 set((state) => ({
 organization: state.organization
 ? { ...state.organization, settings: { ...state.organization.settings, ...settings } }
 : null,
 })),
 reset: () => set({ organization: null }),
 }),
 { name: 'organization-storage' }
 )
);
