import { create } from "zustand";

 interface Agency {
 id: string;
 name: string;
 whiteLabelEnabled: boolean;
 logoUrl?: string;
 primaryColor?: string;
 }

 interface AgencyStore {
 agency: Agency | null;
 setAgency: (agency: Agency) => void;
 clearAgency: () => void;
 }

 export const useAgencyStore = create<AgencyStore>((set) => ({
 agency: null,
 setAgency: (agency) => set({ agency }),
 clearAgency: () => set({ agency: null }),
}));
