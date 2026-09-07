import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { PlanId } from "@prisma/client";
import { PLANS, PlanConfig } from "../lib/plans";

export { PLANS };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 apiVersion: "2024-12-18.acacia",
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function getPlanLimits(planId: PlanId): PlanConfig["limits"] {
 return PLANS[planId]?.limits ?? PLANS.STARTER.limits;
}

// ── Public ──────────────────────────────────────────────────────────────────

export class BillingService {
 /**
 * Create a Stripe checkout session for upgrading/starting a subscription.
 */
 static async createCheckoutSession(
 agencyId: string,
 priceId: string,
 successUrl: string,
 cancelUrl: string
 ): Promise<{ sessionId: string }> {
 const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
 if (!agency) throw new Error("Agency not found");

 let customerId: string | undefined;
 const existingSub = await prisma.subscription.findFirst({
 where: { agencyId },
 orderBy: { createdAt: "desc" });

 if (existingSub?.stripeCustomerId) {
 customerId = existingSub.stripeCustomerId;
 }

 const session = await stripe.checkout.sessions.create({
 mode: "subscription",
 customer: customerId,
 customer_email: customerId ? undefined : `${agency.slug}@temp.com`,
 line_items: [{ price: priceId, quantity: 1 }],
 success_url: successUrl,
 cancel_url: cancelUrl,
 metadata: { agencyId },
 });

 return { sessionId: session.id };
 }

 /**
 * Handle Stripe webhook event.
 */
 static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
 const eventType = event.type;

 if (eventType === "checkout.session.completed") {
 const session = event.data.object as Stripe.Checkout.Session;
 const agencyId = session.metadata?.agencyId;
 if (!agencyId) return;

 const subscription = await stripe.subscriptions.retrieve(
 session.subscription as string
 );

 const planId = Object.entries(PLANS).find(
 ([, p]) => p.priceId === subscription.items.data[0]?.price.id
 )?.[0] as PlanId | undefined;

 await prisma.subscription.create({
 data: {
 agencyId,
 plan: planId ?? "STARTER",
 status: "TRIALING",
 currentPeriodStart: new Date(subscription.current_period_start * 1000),
 currentPeriodEnd: new Date(subscription.current_period_end * 1000),
 stripeCustomerId: subscription.customer as string,
 stripePriceId: subscription.items.data[0]?.price.id ?? "",
 stripeSubscriptionId: subscription.id,
 metadata: {},
 },
 });
 }

 if (eventType === "invoice.payment_succeeded") {
 const invoice = event.data.object as Stripe.Invoice;
 const subscriptionId = invoice.subscription as string;
 await prisma.subscription.updateMany({
 where: { stripeSubscriptionId: subscriptionId },
 data: { status: "ACTIVE" },
 });
 }

 if (eventType === "invoice.payment_failed") {
 const invoice = event.data.object as Stripe.Invoice;
 const subscriptionId = invoice.subscription as string;
 await prisma.subscription.updateMany({
 where: { stripeSubscriptionId: subscriptionId },
 data: { status: "PAST_DUE" },
 });
 }

 if (eventType === "customer.subscription.deleted") {
 const subscription = event.data.object as Stripe.Subscription;
 await prisma.subscription.updateMany({
 where: { stripeSubscriptionId: subscription.id },
 data: { status: "CANCELED", cancelAtPeriodEnd: true },
 });
 }
 }

 /**
 * Cancel a subscription at period end.
 */
 static async cancelSubscription(subscriptionId: string): Promise<void> {
 const sub = await prisma.subscription.findUnique({
 where: { id: subscriptionId },
 });

 if (!sub?.stripeSubscriptionId) throw new Error("Subscription not found");

 await stripe.subscriptions.update(sub.stripeSubscriptionId, {
 cancel_at_period_end: true,
 });

 await prisma.subscription.update({
 where: { id: subscriptionId },
 data: { cancelAtPeriodEnd: true },
 });
 }

 /**
 * Resume a cancelled subscription.
 */
 static async resumeSubscription(subscriptionId: string): Promise<void> {
 const sub = await prisma.subscription.findUnique({
 where: { id: subscriptionId },
 });

 if (!sub?.stripeSubscriptionId) throw new Error("Subscription not found");

 await stripe.subscriptions.update(sub.stripeSubscriptionId, {
 cancel_at_period_end: false,
 });

 await prisma.subscription.update({
 where: { id: subscriptionId },
 data: { cancelAtPeriodEnd: false, status: "ACTIVE" },
 });
 }

 /**
 * Get subscription for agency.
 */
 static async getByAgency(agencyId: string) {
 return prisma.subscription.findFirst({
 where: { agencyId },
 orderBy: { createdAt: "desc" },
 });
 }

 /**
 * Check if agency has hit a limit.
 */
 static async checkLimit(
 agencyId: string,
 resource: "clients" | "integrations" | "reports"
 ): Promise<{ allowed: boolean; current: number; limit: number }> {
 const sub = await this.getByAgency(agencyId);
 const planId = sub?.plan ?? "STARTER";
 const limits = getPlanLimits(planId);

 let current = 0;
 switch (resource) {
 case "clients":
 current = await prisma.client.count({ where: { agencyId } });
 break;
 case "integrations":
 current = await prisma.integration.count({
 where: { client: { agencyId } },
 });
 break;
 case "reports":
 current = await prisma.report.count({ where: { agencyId } });
 break;
 }

 return { allowed: current < limits[resource], current, limit: limits[resource] };
 }

 /**
 * Get plan config by plan ID.
 */
 static getPlanConfig(planId: PlanId): PlanConfig {
 return PLANS[planId];
 }
}
