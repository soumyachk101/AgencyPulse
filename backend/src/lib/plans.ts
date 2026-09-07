import { PlanId } from "@prisma/client";

export interface PlanConfig {
 priceId: string;
 name: string;
 limits: {
 clients: number;
 integrations: number;
 reports: number;
 };
}

export const PLANS: Record<PlanId, PlanConfig> = {
 STARTER: {
 name: "Starter",
 priceId: process.env.STRIPE_STARTER_PRICE_ID ?? "",
 limits: { clients: 5, integrations: 5, reports: 10 },
 },
 GROWTH: {
 name: "Growth",
 priceId: process.env.STRIPE_GROWTH_PRICE_ID ?? "",
 limits: { clients: 25, integrations: 25, reports: 50 },
 },
 AGENCY: {
 name: "Agency",
 priceId: process.env.STRIPE_AGENCY_PRICE_ID ?? "",
 limits: { clients: 100, integrations: 100, reports: 200 },
 },
 ENTERPRISE: {
 name: "Enterprise",
 priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "",
 limits: { clients: 9999, integrations: 9999, reports: 9999 },
 },
};
