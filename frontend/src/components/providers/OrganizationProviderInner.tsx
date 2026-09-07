"use client";

import { createContext, useContext, ReactNode } from "react";

interface OrganizationContextValue {
 organizationId: string | null;
 organizationName: string | null;
 plan: string | null;
 isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

function OrganizationProviderInner({ children, organization }: { children: ReactNode; organization?: { id: string; name: string; plan: string } }) {
 return (
 <OrganizationContext.Provider
 value={{
 organizationId: organization?.id ?? null,
 organizationName: organization?.name ?? null,
 plan: organization?.plan ?? null,
 isLoading: !organization,
 }}
 >
 {children}
 </OrganizationContext.Provider>
 );
}

export function useOrganization() {
 const context = useContext(OrganizationContext);
 if (!context) throw new Error("useOrganization must be used within an OrganizationProvider");
 return context;
}

export default OrganizationProviderInner;
