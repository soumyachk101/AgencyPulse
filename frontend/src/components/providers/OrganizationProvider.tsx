"use client";

import { OrganizationProvider as OrgProvider } from "@/components/providers/OrganizationProviderInner";
import type { ReactNode } from "react";

export function OrganizationProvider({ children, organization }: { children: ReactNode; organization?: { id: string; name: string; plan: string } }) {
 return <OrgProvider organization={organization}>{children}</OrgProvider>;
}
