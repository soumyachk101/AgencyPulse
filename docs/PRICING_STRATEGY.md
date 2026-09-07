# AgencyPulse — Pricing Strategy

**Version:** 1.0
**Date:** September 6, 2026
**Status:** Draft — Internal Use

---

## Table of Contents

1. [Pricing Philosophy](#1-pricing-philosophy)
2. [Tier Breakdown](#2-tier-breakdown)
3. [Annual Billing Discount](#3-annual-billing-discount)
4. [Enterprise Custom Pricing](#4-enterprise-custom-pricing)
5. [Stripe Subscription Setup](#5-stripe-subscription-setup)
6. [Usage-Based and Add-On Pricing](#6-usage-based-and-add-on-pricing)
7. [Pricing Psychology and Positioning](#7-pricing-psychology-and-positioning)
8. [Pricing Evolution](#8-pricing-evolution)

---

## 1. Pricing Philosophy

### 1.1 Core Principles

**1. Transparency over gatekeeping**
We list our prices publicly. No "contact us for pricing" for 90% of the market. This signals confidence, reduces friction, and respects the buyer's time.

**2. Value-based, not cost-based**
Pricing is anchored to the value we deliver — not the cost of our infrastructure. Replacing 80–120 hours of manual reporting per month per agency is worth hundreds to thousands of dollars. Our plans are priced at a fraction of that value.

**3. Simplicity over complexity**
Four tiers. Clear feature differences. No hidden fees, no surprise overages. Buyers should understand what they're getting in under 60 seconds.

**4. White-label as a default, not a premium**
Agencies need white-label reports to do their jobs. Charging extra for it is a race to the bottom on customer relationships.

**5. Growth-friendly billing**
Annual billing with 2 months free rewards commitment and improves our cash flow. Monthly billing is available for flexibility.

### 1.2 Pricing Anchor

- **Manual reporting cost:** $6,000–$12,000 per agency per month (80–120 hours at $75/hr blended rate)
- **AgencyPulse Starter:** $29/mo = **0.5% of manual cost**
- **AgencyPulse Growth:** $79/mo = **1.3% of manual cost**
- **AgencyPulse Agency:** $149/mo = **2.5% of manual cost**

Every plan pays for itself in under 2 hours of recovered time.

---

## 2. Tier Breakdown

### 2.1 Starter — $29/mo ($290/yr)

**Target customer:** Solo freelancers, new agencies (1–2 people), consultants testing AgencyPulse

| Feature | Starter |
|---|---|
| **Client limit** | 5 clients |
| **Integrations** | 2 platforms (Google Ads + GA4) |
| **Report scheduling** | Monthly only |
| **Report recipients** | 1 per client |
| **AI insights** | Basic (3 insights per report) |
| **White-label** | Logo + color (basic branding) |
| **Custom KPIs** | 3 per client |
| **Data retention** | 12 months |
| **Support** | Email support (48 hr response) |
| **API access** | No |
| **Team members** | 1 user |

**Why this tier exists:**
- Entry point for solo operators who can't justify $79/mo
- 90-day trial / evaluation period before upgrading
- Natural funnel into Growth tier as agency grows

**Conversion trigger:** Client count exceeds 5, or need for Meta Ads integration, or need for white-label branding.

### 2.2 Growth — $79/mo ($790/yr)

**Target customer:** Growing agencies (3–10 people), social media managers, SEO consultants with multiple clients

| Feature | Growth |
|---|---|
| **Client limit** | 20 clients |
| **Integrations** | All 3 (Google Ads + Meta Ads + GA4) |
| **Report scheduling** | Weekly, monthly, quarterly |
| **Report recipients** | 5 per client |
| **AI insights** | Full (5–7 insights per report, anomaly detection) |
| **White-label** | Full branding kit (logo, colors, fonts, custom domain) |
| **Custom KPIs** | Unlimited per client |
| **Data retention** | 24 months |
| **Support** | Priority email + chat (24 hr response) |
| **API access** | Read-only API |
| **Team members** | 5 users |
| **Slack integration** | Yes |
| **Report export formats** | PDF, CSV |

**Why this tier is the sweet spot:**
- $79/mo replaces $2,400–$6,000/month of manual reporting time
- Most agencies on Growth have 10–20 clients, fitting comfortably within limits
- Full white-label means the agency can present reports as their own
- AI insights provide the "wow factor" that justifies the upgrade from Starter

**Conversion trigger:** Client count exceeds 20, need for team collaboration (more than 1 user), need for Slack integration.

### 2.3 Agency — $149/mo ($1,490/yr)

**Target customer:** Established agencies (10–50+ employees), multi-client agencies needing unlimited scale

| Feature | Agency |
|---|---|
| **Client limit** | Unlimited |
| **Integrations** | All current + priority access to new connectors |
| **Report scheduling** | Weekly, monthly, quarterly, custom cadences |
| **Report recipients** | Unlimited per client |
| **AI insights** | Full + predictive trends + report quality scoring |
| **White-label** | Full branding kit + custom domain + remove AgencyPulse branding |
| **Custom KPIs** | Unlimited per client |
| **Data retention** | Unlimited (24 months rolling, archives available) |
| **Support** | Priority email + chat + phone (4 hr response) |
| **API access** | Full API (read + write) |
| **Team members** | Unlimited |
| **All integrations** | Slack, Google Drive, Dropbox, Zapier |
| **Report export formats** | PDF, CSV, Google Sheets, HTML |
| **Client portal** | Custom subdomain |
| **Dedicated account manager** | Yes (from 50+ clients) |
| **SLA** | 99.5% uptime |

**Why this tier exists:**
- Unlimited clients removes the upgrade ceiling that frustrates growing agencies
- Phone support and SLA are table stakes for agencies managing client revenue
- Custom subdomain client portal signals enterprise-grade trust
- $149/mo is still dramatically cheaper than enterprise alternatives ($500–$2,000/mo)

### 2.4 Enterprise — Custom Pricing

**Target customer:** Large agencies (50+ employees, 100+ clients), holding companies, white-label resellers

| Feature | Enterprise |
|---|---|
| **Client limit** | Unlimited |
| **Integrations** | Custom integrations built on request |
| **Everything in Agency** | Yes |
| **Data retention** | Unlimited + historical import |
| **Support** | Dedicated CSM + 24/7 priority support + 1 hr SLA |
| **API access** | Full API + webhooks + custom rate limits |
| **Team members** | Unlimited + SSO (SAML/OIDC) |
| **Security** | SOC 2 Type II, BAA, DPA |
| **Deployment** | Dedicated infrastructure option |
| **Custom branding** | Fully white-labeled (no AgencyPulse reference) |
| **Contract terms** | Annual or multi-year |
| **Pricing** | Custom — typically $500–$3,000/mo based on client count and feature needs |

**Pricing methodology for Enterprise:**
- Base: $500/mo
- Per 50 clients: +$200/mo
- Custom integrations: +$500–$2,000 one-time + $100–$500/mo maintenance
- SSO / SAML: +$100/mo
- Dedicated infrastructure: +$500–$1,000/mo
- SLA commitment: +$200/mo

---

## 3. Annual Billing Discount

### 3.1 Discount Structure

| Plan | Monthly | Annual | Savings | Effective Monthly |
|---|---|---|---|---|
| Starter | $29/mo | $290/yr | $58 (2 months free) | **$24.17/mo** |
| Growth | $79/mo | $790/yr | $158 (2 months free) | **$65.83/mo** |
| Agency | $149/mo | $1,490/yr | $298 (2 months free) | **$124.17/mo** |

**Discount: 2 months free (16.7% discount) on annual billing.**

### 3.2 Why 2 Months Free

- Industry standard for B2B SaaS (similar to HubSpot, Intercom, Mailchimp)
- Enough incentive to commit annually without leaving too much money on the table
- Improves cash flow and reduces churn (annual commitment = stickier)
- At 16.7% discount, LTV actually increases due to reduced churn risk and upfront cash

### 3.3 Annual Billing Conversion Tactics

1. **Default to annual** on the pricing page (monthly as secondary option)
2. **Savings badge:** "Save $158/year — billed annually" prominently displayed
3. **Risk reversal:** "30-day money-back guarantee — try annual risk-free"
4. **Upgrade path:** Annual subscribers can downgrade to monthly at plan boundaries
5. **Early-bird discount:** Founding customers get annual pricing locked in permanently

---

## 4. Enterprise Custom Pricing

### 4.1 Enterprise Sales Motion

Enterprise deals follow a structured sales process:

1. **Inquiry:** Form on pricing page ("Enterprise" button) or inbound from conference/partner
2. **Discovery call (30 min):** Understand client count, integration needs, security requirements, timeline
3. **Custom proposal:** 2–3 page document with line-item pricing, SLA terms, implementation timeline
4. **Proof of concept:** 14-day trial with custom configuration (if needed)
5. **Contract:** Annual or multi-year, e-signed via PandaDoc or DocuSign
6. **Onboarding:** Dedicated onboarding specialist, custom integration setup if needed

### 4.2 Enterprise Pricing Tiers

| Client Count | Base Price | Per-Client Overage | Typical Monthly |
|---|---|---|---|
| Up to 50 clients | $500/mo | — | $500/mo |
| 51–200 clients | $500/mo + $4/client | $4/client | $500–$1,300/mo |
| 201–500 clients | $1,000/mo + $3/client | $3/client | $1,000–$2,500/mo |
| 501–1,000 clients | $2,000/mo + $2/client | $2/client | $2,000–$4,000/mo |
| 1,000+ clients | Custom | Custom | Custom quote |

### 4.3 Enterprise Add-Ons

| Add-On | Monthly Price | Description |
|---|---|---|
| SSO / SAML | $100/mo | Single sign-on via Okta, Azure AD, OneLogin |
| Custom integration | $500–$2,000/mo | Build and maintain platform-specific connectors |
| Dedicated infrastructure | $500–$1,000/mo | Isolated deployment, dedicated database |
| Enhanced SLA | $200/mo | 99.9% uptime commitment, 1-hour response time |
| Data processing agreement (DPA) | Included | GDPR / CCPA compliance documentation |
| Historical data import | $500–$2,000 one-time | Import historical data from previous tool |
| Onboarding / training | $500–$1,500 | Custom onboarding sessions for agency teams |

---

## 5. Stripe Subscription Setup

### 5.1 Stripe Product Configuration

**Products to create in Stripe:**

| Product ID | Name | Type |
|---|---|---|
| `prod_starter_monthly` | AgencyPulse Starter (Monthly) | Service |
| `prod_starter_annual` | AgencyPulse Starter (Annual) | Service |
| `prod_growth_monthly` | AgencyPulse Growth (Monthly) | Service |
| `prod_growth_annual` | AgencyPulse Growth (Annual) | Service |
| `prod_agency_monthly` | AgencyPulse Agency (Monthly) | Service |
| `prod_agency_annual` | AgencyPulse Agency (Annual) | Service |

**Prices to create in Stripe:**

| Price ID | Product | Amount | Interval | Currency |
|---|---|---|---|---|
| `price_starter_monthly` | Starter Monthly | $2,900 ($29.00) | month | USD |
| `price_starter_annual` | Starter Annual | $29,000 ($290.00) | year | USD |
| `price_growth_monthly` | Growth Monthly | $7,900 ($79.00) | month | USD |
| `price_growth_annual` | Growth Annual | $79,000 ($790.00) | year | USD |
| `price_agency_monthly` | Agency Monthly | $14,900 ($149.00) | month | USD |
| `price_agency_annual` | Agency Annual | $149,000 ($1,490.00) | year | USD |

### 5.2 Stripe Subscription Flow

```
User selects plan → Clicks "Start Free Trial"
 → Frontend creates Stripe Customer
 → Frontend creates Stripe Subscription with:
 - price: selected plan price ID
 - trial_period_days: 14
 - metadata: { agencyId, plan, userId }
 → Stripe returns subscription status = "trialing"
 → Backend records subscription in database
 → User sees "Trial active — 14 days remaining"
```

### 5.3 Webhook Events to Handle

| Event | Action |
|---|---|
| `customer.subscription.created` | Record trial start, send welcome email |
| `customer.subscription.trial_will_end` | Send trial ending reminder (3 days before) |
| `invoice.payment_succeeded` | Update subscription status to "active", send receipt |
| `invoice.payment_failed` | Notify user, retry with dunning logic, update status |
| `customer.subscription.updated` | Handle plan changes (upgrade/downgrade), proration |
| `customer.subscription.deleted` | Downgrade to free tier, archive data after 90 days |
| `invoice.upcoming` | Send payment reminder 3 days before charge |

### 5.4 Dunning Management

| Retry | Timing | Action |
|---|---|---|
| Attempt 1 | Payment due date | Charge card |
| Attempt 2 | +3 days | Retry charge + email reminder |
| Attempt 3 | +7 days | Final retry + final warning email |
| Grace period | +14 days | Account restricted (read-only) |
| Cancellation | +21 days | Subscription cancelled, data archived |

**Email templates for dunning:**
- Day 0: "Your payment failed — please update your payment method"
- Day 3: "Reminder: Please update your payment method to avoid service interruption"
- Day 7: "Final notice: Your subscription will be cancelled in 7 days"
- Day 14: "Your account has been restricted. Update payment to restore access."

### 5.5 Proration Logic

**When a user upgrades mid-cycle:**
- Stripe automatically prorates: `(new_price - old_price) / days_remaining × days_used`
- Or use Stripe's `proration_behavior: create_prorations` for automatic handling
- Invoice the prorated amount immediately

**When a user downgrades mid-cycle:**
- Stripe applies credit to next invoice
- Or allow downgrade at next billing cycle (recommended to avoid confusion)
- Downgrade takes effect at period end

### 5.6 Tax Handling

- Use Stripe Tax for automatic tax calculation
- Configure tax categories:
 - SaaS: `txcd_10000000` (Digital products and services)
 - Variable tax rates by country/state
- Display tax-inclusive pricing in regions where required (EU, UK, etc.)

### 5.7 Subscription Management UI

Features the pricing/billing page should include:

| Feature | Description |
|---|---|
| Current plan display | Shows plan name, price, billing cycle, next billing date |
| Usage meter | Shows client count vs. limit, integration count |
| Upgrade/downgrade | One-click plan changes with proration preview |
| Plan comparison | Side-by-side feature comparison for current vs. desired plan |
| Billing history | Table of past invoices with download links |
| Payment method | Card on file display, update/remove |
| Cancel subscription | Cancel flow with pause option + retention offer (20% off 3 months) |
| Tax information | VAT ID field for EU businesses |

---

## 6. Usage-Based and Add-On Pricing

### 6.1 Overages

| Plan | Limit | Overage Rate |
|---|---|---|
| Starter | 5 clients | Cannot upgrade — must move to Growth |
| Growth | 20 clients | Cannot exceed — must upgrade to Agency |
| Agency | Unlimited | No overage |

**Policy:** Hard limits on client counts (not soft limits with overage charges). This keeps pricing predictable and avoids bill shock. Upgrade prompts are shown at 80% of limit.

### 6.2 Add-Ons (Future)

| Add-On | Price | Description |
|---|---|---|
| Extra report recipients (Growth) | $5/recipient/mo | Beyond 5 recipients per client |
| Additional integrations (Starter) | $10/integration/mo | Beyond 2 platforms |
| Extended data retention | $5/client/mo | Beyond 24 months |
| White-label client portal (Growth) | $19/mo | Custom subdomain (normally Agency-only) |
| Priority support | $29/mo | 4-hour response time (normally Agency-only) |

---

## 7. Pricing Psychology and Positioning

### 7.1 Price Anchoring

The pricing page uses visual anchoring:

```
[Enterprise] Custom [Agency] $149/mo [Growth] $79/mo [Starter] $29/mo
 ↑ Recommended ↑ Popular ↑ Entry
 (largest) (highlighted) (smallest)
```

- Agency tier is visually emphasized ("Most Popular" badge, slightly larger card)
- Enterprise tier anchors the top, making Agency feel reasonable by comparison
- Starter tier provides an accessible entry point but is visually de-emphasized

### 7.2 Charm Pricing

- Use $29, $79, $149 (ending in 9) for monthly plans
- Annual pricing uses round numbers ($290, $790, $1,490) — feels more "enterprise"
- The "2 months free" framing of annual pricing emphasizes savings over discount percentage

### 7.3 Decoy Effect (Optional)

An alternative pricing layout:

```
Growth — $79/mo ← Most Popular, "Best Value"
Agency — $149/mo
Starter — $29/mo ← "Good for freelancers"
```

The Agency tier acts as a decoy making Growth look like the obvious best value.

### 7.4 Free Trial Positioning

- 14-day free trial on all plans (full feature access for Growth tier during trial)
- "No credit card required" for signup → reduces friction
- Card required at trial end → filters out non-serious users
- Trial extension option: "Need more time? Email us for a 7-day extension"

---

## 8. Pricing Evolution

### 8.1 Year 1 Pricing

Launch with the three-tier structure. Validate pricing through:
- Customer interviews: "Was this worth it?"
- Conversion rate: Is the Growth-to-Agency upgrade rate healthy?
- Churn analysis: Are Starter users churning because of price or lack of value?

### 8.2 Year 2 Pricing Adjustments (Potential)

| Change | Rationale |
|---|---|
| Increase Growth to $89/mo | 20% price increase after product-market fit, justified by new features (Slack, Drive) |
| Add "Teams" tier at $99/mo | Bridge between Growth and Agency for agencies at 20–50 clients |
| Add usage-based add-ons | Monetize power users without penalizing average users |
| Annual-only discount increases to 25% | Encourage annual commitments further |

### 8.3 Year 3+ Pricing Evolution

- Enterprise pricing becomes a larger revenue driver (target: 15% of revenue from Enterprise)
- Introduce platform-specific connectors as paid add-ons (TikTok, LinkedIn, Shopify)
- Consider usage-based pricing at scale (per-1000 API calls, per-GB data processed)
- Explore reseller / white-label pricing for agencies wanting to offer AgencyPulse to their own clients

---

*End of Pricing Strategy*
