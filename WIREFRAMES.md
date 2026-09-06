# AgencyPulse — Wireframes Documentation

**Version:** 1.0
**Date:** 2026-09-06

This document contains ASCII wireframes for all major pages in AgencyPulse. These wireframes represent the structural layout and content hierarchy of each page, using monospaced characters to approximate the visual design.

---

## Table of Contents

1. [Landing Page](#1-landing-page)
2. [Login / Sign Up](#2-login--sign-up)
3. [Agency Dashboard](#3-agency-dashboard)
4. [Client List](#4-client-list)
5. [Client Detail — Overview Tab](#5-client-detail--overview-tab)
6. [Client Detail — Integrations Tab](#6-client-detail--integrations-tab)
7. [Client Detail — Reports Tab](#7-client-detail--reports-tab)
8. [Client Detail — KPIs Tab](#8-client-detail--kpis-tab)
9. [Client Detail — Settings Tab](#9-client-detail--settings-tab)
10. [Report Builder](#10-report-builder)
11. [Report Preview / PDF Viewer](#11-report-preview--pdf-viewer)
12. [Template Gallery](#12-template-gallery)
13. [Template Editor](#13-template-editor)
14. [Billing Page](#14-billing-page)
15. [Settings — Agency](#15-settings--agency)
16. [Settings — Branding](#16-settings--branding)
17. [Settings — Team](#17-settings--team)
18. [Onboarding Wizard](#18-onboarding-wizard)
19. [Mobile Adaptations](#19-mobile-adaptations)

---

## 1. Landing Page

```
================================================================
AGENCYPULSE Features Pricing Sign In
----------------------------------------------------------------

 Turn Hours of Reporting Into
 One-Click Narrative PDFs

 Auto-pull data from Google Ads, Meta Ads, and GA4.
 Generate branded PDF reports with AI-written insights.
 Deliver them to clients on schedule — white-labeled.

 ________________________________________________________
 | Enter your work email Get Started |
 --------------------------------------------------------

 Trusted by 200+ agencies
 [Logo1] [Logo2] [Logo3] [Logo4] [Logo5]

----------------------------------------------------------------
 HOW IT WORKS
 Step 1 Step 2 Step 3
 Connect Configure Deliver
 [Icon] [Icon] [Icon]
 Link your Set up Reports auto-
 ad accounts branding, deliver to
 templates, your clients
 and schedule

----------------------------------------------------------------
 FEATURES
 +-----------------+ +-----------------+ +-----------------+
 | Auto Sync | | White-Label | | AI Insights |
 | | | Branding | | |
 | Pulls data | | Your logo, | | GPT-4o writes |
 | from 3+ | | colors, fonts | | plain-English |
 | platforms | | on every | | narratives |
 | automatically | | report page | | with context |
 +-----------------+ +-----------------+ +-----------------+

 +-----------------+ +-----------------+ +-----------------+
 | Smart Reports | | Scheduled | | Multi-Client |
 | | | Delivery | | Management |
 | Executive | | Weekly, | | Manage 100+ |
 | summaries, | | monthly, | | clients from |
 | MoM/YoY | | quarterly — | | one dashboard |
 | comparisons | | hands-off | | |
 +-----------------+ +-----------------+ +-----------------+

----------------------------------------------------------------
 PRICING
 [Monthly] [Annual (Save 20%)]

 +--- Starter ---+ +---- Growth ----+ +---- Agency -----+
 | $29/month | | $79/month | | $149/month |
 | | | | | |
 | 5 clients | | 25 clients | | 100 clients |
 | 25 reports | | 100 reports | | Unlimited |
 | 3 data source | | 9 data sources | | Unlimited |
 | 1 team member | | 3 members | | 10 members |
 | | | AI recs | | AI + Portal |
 | [Start Trial] | | [Start Trial] | | [Start Trial] |
 +---------------+ +----------------+ +----------------+

----------------------------------------------------------------
 Ready to transform your reporting?

 Get started free — no credit card required.

 [Email input] [Get Started Now]

----------------------------------------------------------------
 Product Company Resources Legal
 Features About Blog Privacy Policy
 Pricing Careers Docs Terms of Service
 Integrations Contact Support Cookie Policy

 (c) 2026 AgencyPulse. All rights reserved.
================================================================
```

---

## 2. Login / Sign Up

```
================================================================
AGENCYPULSE 
----------------------------------------------------------------

 Sign in to your account

 ________________________________________
 | Email |
 |________________________________________|
 | Password |
 |________________________________________|
 | [ ] Remember me Forgot password? |
 |________________________________________|
 | Sign In |
 |________________________________________|

 Don't have an account? Sign up for free

 ────── or continue with ──────

 [ Google ] [ Microsoft ]

----------------------------------------------------------------

 Create your account

 ________________________________________
 | Full Name |
 |________________________________________|
 | Email |
 |________________________________________|
 | Password (min 8 characters) |
 |________________________________________|
 | Confirm Password |
 |________________________________________|
 | [ ] I agree to Terms & Privacy Policy |
 |________________________________________|
 | Create Account |
 |________________________________________|

 Already have an account? Sign in

================================================================
```

---

## 3. Agency Dashboard

```
================================================================
AGENCYPULSE [🔍 Search...] 🔔(3) 👤 Sarah Johnson ▼
----------------------------------------------------------------
| 🏠 Dashboard 📋 Clients 📊 Reports 📑 Templates 🔌 ... |
| ⚙️ Settings 💳 Billing [Collapse] |
----------------------------------------------------------------
│ │
│ Dashboard │
│ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ │ 42 │ │ 156 │ │ 94% │ │ 2.4h │
│ │ Clients │ │ Reports │ │ Open │ │ Avg Sync │
│ │ │ │ │ │ Rate │ │ Health │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘
│ │
│ Recent Reports [+ New]
│ ┌──────────────────────────────────────────────────┐
│ │ Client │ Period │ Status │ Date │ ···│
│ ├──────────────────────────────────────────────────┤
│ │ Acme Corp │ Aug 2026 │ ✓ Sent │ Sep 1 │ ···│
│ │ Beta Inc │ Aug 2026 │ ✎ Draft │ Sep 2 │ ···│
│ │ Gamma LLC │ Aug 2026 │ ✓ Sent │ Sep 1 │ ···│
│ │ Delta Co │ Jul 2026 │ ✓ Sent │ Aug 1 │ ···│
│ │ Echo Agency │ Jul 2026 │ ⚠ Failed│ Aug 2 │ ···│
│ └──────────────────────────────────────────────────┘
│ │
│ Quick Actions │
│ [+ Add Client] [⚡ Generate All Reports] [🔄 Sync All]
│ │
================================================================
```

---

## 4. Client List

```
================================================================
AGENCYPULSE [🔍 Search...] 🔔(3) 👤 Sarah Johnson ▼
----------------------------------------------------------------
│ Clients [+ Add Client]│
│ │
│ 🔍 Search clients... [Industry ▼] [Status ▼]│
│ │
│ Sort by: [Name ▼] View: [Grid] [List] │
│ │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Acme Corp │ │ Beta Inc │ │ Gamma LLC │ │
│ │ │ │ │ │ │ │
│ │ 🟢 Google │ │ 🟢 Google │ │ 🟡 Google │ │
│ │ 🟢 Meta │ │ 🔴 Meta │ │ 🟢 Meta │ │
│ │ 🟢 GA4 │ │ 🟢 GA4 │ │ 🟢 GA4 │ │
│ │ │ │ │ │ │ │
│ │ Last: Aug │ │ Last: Aug │ │ Last: Aug │ │
│ │ Status: ✓ │ │ Status: ✎ │ │ Status: ✓ │ │
│ │ Spend: $4k │ │ Spend: $2k │ │ Spend: $8k │ │
│ │ │ │ │ │ │ │
│ │ [Generate] │ │ [Generate] │ │ [Generate] │ │
│ └────────────┘ └────────────┘ └────────────┘ │
│ │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Delta Co │ │ Echo Agency│ │ + Add │ │
│ │ │ │ │ │ Client │ │
│ │ 🔴 Google │ │ 🟢 Google │ │ │ │
│ │ 🟢 Meta │ │ 🟢 Meta │ │ [dashed │ │
│ │ ⚫ GA4 │ │ 🟢 GA4 │ │ border] │ │
│ │ │ │ │ │ │ │
│ │ Last: Jul │ │ Last: Jul │ │ + │ │
│ │ Status: ✓ │ │ Status: ⚠ │ │ │ │
│ │ Spend: $1k │ │ Spend: $3k │ │ │ │
│ │ │ │ │ │ │ │
│ │ [Generate] │ │ [Generate] │ │ │ │
│ └────────────┘ └────────────┘ └────────────┘ │
│ │
│ Showing 1-6 of 42 clients│
│ [← Prev] [1] 2 3...7 [Next →]
│ │
================================================================
```

---

## 5. Client Detail — Overview Tab

```
================================================================
← Clients Acme Corp [Generate Report] [···]│
----------------------------------------------------------------
│ [Overview] [Integrations] [Reports] [KPIs] [Settings] │
----------------------------------------------------------------
│ │
│ Key Metrics — August 2026 │
│ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ │ $45,230 │ │ 12.4% │ │ 3.2x │ │ 1,847 │
│ │ Total │ │ Avg CTR │ │ ROAS │ │ Conv. │
│ │ Spend │ │ ↑ 2.1% │ │ ↑ 0.4x │ │ ↑ 312 │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘
│ │
│ Spend Over Time │
│ ┌──────────────────────────────────────────────────┐
│ │ │
│ │ $50k ┤ ╱── │
│ │ │ ╱──╱ │
│ │ $40k ┤ ╱──╱ │
│ │ │ ╱──╱ │
│ │ $30k ┤ ╱──╱ ─ ─ Google │
│ │ │ ╱──╱ ─ ─ Meta │
│ │ $20k ┤ ╱──╱ ─ ─ GA4 │
│ │ │ ╱──╱ │
│ │ $10k ┤╱ │
│ │ └──────┬──────┬──────┬──────┬──────┬── │
│ │ Jun Jul Aug Sep Oct │
│ └──────────────────────────────────────────────────┘
│ │
│ Performance by Platform │
│ │
│ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Google Ads │ │ Meta Ads │ │
│ │ ████████████░░ │ │ ██████░░░░░░░░ │ │
│ │ Spend: $18,400 │ │ Spend: $15,200 │ │
│ │ Clicks: 8,420 │ │ Clicks: 6,100 │ │
│ │ CTR: 3.2% ↑ │ │ CTR: 2.1% ↓ │ │
│ │ CPA: $24.50 │ │ CPA: $31.20 │ │
│ └─────────────────┘ └─────────────────┘ │
│ │
│ ┌─────────────────┐ │
│ │ GA4 │ │
│ │ ██████████░░░░ │ │
│ │ Sessions: 24.5k │ │
│ │ Bounce: 42% ↓ │ │
│ │ Conv: 892 │ │
│ └─────────────────┘ │
│ │
│ Recent Reports │
│ ┌────────────────────────────────────────────────┐
│ │ Aug 2026 ✓ Sent Sep 1 [View] [Download] │
│ │ Jul 2026 ✓ Sent Aug 1 [View] [Download] │
│ │ Jun 2026 ✓ Sent Jul 1 [View] [Download] │
│ └────────────────────────────────────────────────┘
│ │
================================================================
```

---

## 6. Client Detail — Integrations Tab

```
================================================================
← Clients Acme Corp — Integrations [···]│
----------------------------------------------------------------
│ [Overview] [Integrations] [Reports] [KPIs] [Settings]│
----------------------------------------------------------------
│ │
│ Connected Data Sources │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🔵 Google Ads [Connected] │ │
│ │ │ │
│ │ Account: Acme Corp (123-456-7890) │ │
│ │ Status: 🟢 Connected │ │
│ │ Last synced: 2 hours ago │ │
│ │ Metrics: Impressions, Clicks, CTR, CPC, │ │
│ │ Conversions, Cost, ROAS │ │
│ │ │ │
│ │ [Sync Now] [Disconnect] [Settings] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🟠 Meta Ads (Facebook/Instagram) [Connected] │ │
│ │ │ │
│ │ Account: Acme Digital (act_123456789) │ │
│ │ Status: 🟢 Connected │ │
│ │ Last synced: 4 hours ago │ │
│ │ Metrics: Impressions, Reach, Clicks, CPC, │ │
│ │ CTR, Spend, Conversions, CPA, ROAS │ │
│ │ │ │
│ │ [Sync Now] [Disconnect] [Settings] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 📊 GA4 [Connected] │ │
│ │ │ │
│ │ Property: Acme Website │ │
│ │ Status: 🟢 Connected │ │
│ │ Last synced: 1 hour ago │ │
│ │ Metrics: Sessions, Users, Bounce Rate, │ │
│ │ Engagement, Conversions, Revenue │ │
│ │ │ │
│ │ [Sync Now] [Disconnect] [Settings] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ + Connect New Integration │ │
│ │ [dashed border, plus icon] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Data Sync History │
│ ┌────────────────────────────────────────────────┐
│ │ Now Google Ads ✓ Synced 42 metrics │
│ │ 4h ago Meta Ads ✓ Synced 38 metrics │
│ │ 5h ago GA4 ✓ Synced 56 metrics │
│ │ 1d ago Google Ads ✓ Synced 42 metrics │
│ │ 2d ago Meta Ads ⚠ Partial 38 metrics │
│ └────────────────────────────────────────────────┘
│ │
================================================================
```

---

## 7. Client Detail — Reports Tab

```
================================================================
← Clients Acme Corp — Reports [···]│
----------------------------------------------------------------
│ [Overview] [Integrations] [Reports] [KPIs] [Settings]│
----------------------------------------------------------------
│ │
│ [+ Generate New Report] │
│ │
│ ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐
│ │ August 2026 │ │ July 2026 │ │ June 2026 │
│ │ │ │ │ │ │
│ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌───────────┐ │
│ │ │ │ │ │ │ │ │ │ │ │ │
│ │ │ [PDF │ │ │ │ [PDF │ │ │ │ [PDF │ │
│ │ │ Thumb │ │ │ │ Thumb │ │ │ │ Thumb │ │
│ │ │ preview] │ │ │ │ preview] │ │ │ │ preview] │ │
│ │ │ │ │ │ │ │ │ │ │ │ │
│ │ └─────────────┘ │ │ └─────────────┘ │ │ └───────────┘ │
│ │ │ │ │ │ │
│ │ ✓ Sent │ │ ✓ Sent │ │ ✓ Sent │
│ │ Sep 1, 2026 │ │ Aug 1, 2026 │ │ Jul 1, 2026 │
│ │ │ │ │ │ │
│ │ [View] [Down] │ │ [View] [Down] │ │ [View] [Down] │
│ └─────────────────┘ └─────────────────┘ └────────────────┘
│ │
│ ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐
│ │ May 2026 │ │ April 2026 │ │ + Create │
│ │ │ │ │ │ Template │
│ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ │
│ │ │ [PDF │ │ │ │ [PDF │ │ │ [dashed │
│ │ │ Thumb │ │ │ │ Thumb │ │ │ border, │
│ │ │ preview] │ │ │ │ preview] │ │ │ + icon] │
│ │ │ │ │ │ │ │ │ │ │
│ │ └─────────────┘ │ │ └─────────────┘ │ │ │
│ │ │ │ │ │ │
│ │ ✓ Sent │ │ ✓ Sent │ │ │
│ │ Jun 1, 2026 │ │ May 1, 2026 │ │ │
│ │ │ │ │ │ │
│ │ [View] [Down] │ │ [View] [Down] │ │ │
│ └─────────────────┘ └─────────────────┘ └────────────────┘
│ │
│ Showing 1-6 of 18 reports [← Prev] [1] 2 3 [Next →]│
│ │
================================================================
```

---

## 8. Client Detail — KPIs Tab

```
================================================================
← Clients Acme Corp — KPIs [···]│
----------------------------------------------------------------
│ [Overview] [Integrations] [Reports] [KPIs] [Settings]│
----------------------------------------------------------------
│ │
│ Custom KPIs [+ Add KPI] │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ ROAS Target [Edit] [Del] │ │
│ │ Formula: Revenue / Total Spend │ │
│ │ Current: 3.2x Target: 3.0x 🟢 Met │ │
│ │ Trend: ↑ +0.4x from last month │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Cost Per Qualified Lead [Edit] [Del] │ │
│ │ Formula: Total Spend / Qualified Leads │ │
│ │ Current: $45.20 Target: $40.00 🟡 At Risk │ │
│ │ Trend: ↑ +$5.30 from last month │ │
│ │ Alert: Above target threshold │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Conversion Rate [Edit] [Del] │ │
│ │ Formula: Conversions / Clicks × 100 │ │
│ │ Current: 4.8% Target: 5.0% 🟡 At Risk │ │
│ │ Trend: ↓ -0.3% from last month │ │
│ │ Alert: Below target threshold │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Monthly New Users [Edit] [Del] │ │
│ │ Source: GA4 │ │
│ │ Current: 1,240 Target: 1,500 🔴 Missed │ │
│ │ Trend: ↓ -180 from last month │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Avg Session Duration [Edit] [Del] │ │
│ │ Source: GA4 │ │
│ │ Current: 2m 34s Target: 3m 00s 🔴 Missed │ │
│ │ Trend: ↓ -12s from last month │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ KPI Thresholds │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🟢 Met 0% — 100% of target │ │
│ │ 🟡 At Risk 80% — 99% of target │ │
│ │ 🔴 Missed Below 80% of target │ │
│ └─────────────────────────────────────────────┘ │
│ │
================================================================
```

---

## 9. Client Detail — Settings Tab

```
================================================================
← Clients Acme Corp — Settings [···]│
----------------------------------------------------------------
│ [Overview] [Integrations] [Reports] [KPIs] [Settings]│
----------------------------------------------------------------
│ │
│ Branding │
│ ┌─────────────────────────────────────────────┐ │
│ │ Logo: │ │
│ │ ┌──────────┐ [Upload New Logo] │ │
│ │ │ [Logo │ │ │
│ │ │ Preview]│ │ │
│ │ └──────────┘ │ │
│ │ │ │
│ │ Primary Color: [#8B5CF6 ■] │ │
│ │ Secondary Color: [#7C3AED ■] │ │
│ │ Font: [Inter ▼] │ │
│ │ │ │
│ │ [Use Agency Default] [Save Custom Brand] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Report Schedule │
│ ┌─────────────────────────────────────────────┐ │
│ │ Schedule Reports: [✓ Enabled] │ │
│ │ │ │
│ │ Frequency: [Monthly ▼] │ │
│ │ Day: [1st ▼] (1st–28th or Last Day) │ │
│ │ Time: [09:00 ▼] Timezone: [EST ▼] │ │
│ │ │ │
│ │ Template: [Default Report ▼] │ │
│ │ │ │
│ │ Recipients: │ │
│ │ • john@client.com (Client) [Remove]│ │
│ │ • sarah@acme.com (Account Manager) [Remove]│ │
│ │ [+ Add Recipient] │ │
│ │ │ │
│ │ Email Subject: [Monthly Report - {{client}}] │ │
│ │ From Name: [Acme Digital Team] │ │
│ │ Reply-To: reports@acme.com │ │
│ │ │ │
│ │ [Save Schedule] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Notifications │
│ ┌─────────────────────────────────────────────┐ │
│ │ ☑ Notify me when report is generated │ │
│ │ ☑ Notify me when report delivery fails │ │
│ │ ☑ Notify me when sync fails │ │
│ │ ☐ Notify client when report is ready │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Danger Zone │
│ ┌─────────────────────────────────────────────┐ │
│ │ [Delete Client] │ │
│ │ This will remove all data and reports. │ │
│ └─────────────────────────────────────────────┘ │
│ │
================================================================
```

---

## 10. Report Builder

```
================================================================
← Clients Acme Corp Report Builder [Preview] [Save]│
----------------------------------------------------------------
│ Client: [Acme Corp ▼] Period: [Aug 1–31, 2026] │
│ Template: [Default Report ▼] │
----------------------------------------------------------------
│ │
│ ┌─────────────────┐ ┌───────────────────────────┐ │
│ │ │ │ │ │
│ │ Report Sections │ │ Section Editor │ │
│ │ │ │ │ │
│ │ ☑ Cover Page │ │ Title: │ │
│ │ ⋮⋮ │ │ [Executive Summary ] │ │
│ │ │ │ │ │
│ │ ☑ Executive │ │ AI Narrative: ☑ Enabled │ │
│ │ Summary │ │ Tone: [Professional ▼] │ │
│ │ ⋮⋮ │ │ Max Length: [3 bullets] │ │
│ │ │ │ │ │
│ │ ☑ Google Ads │ │ Content: │ │
│ │ ⋮⋮ │ │ ┌───────────────────────┐ │ │
│ │ │ │ │ Google Ads delivered │ │ │
│ │ ☑ Meta Ads │ │ │ strong performance in │ │ │
│ │ ⋮⋮ │ │ │ August, with a 23% │ │ │
│ │ │ │ │ increase in ROAS │ │ │
│ │ ☑ GA4 │ │ │ compared to July. │ │ │
│ │ ⋮⋮ │ │ │ ... │ │ │
│ │ │ │ │ │ │ │
│ │ ☑ Key │ │ └───────────────────────┘ │ │
│ │ Highlights │ │ │ │
│ │ ⋮⋮ │ │ [Regenerate with AI] │ │
│ │ │ │ Word count: 142/200 │ │
│ │ ☑ Recommenda- │ │ │ │
│ │ tions │ │ Charts in this section: │ │
│ │ ⋮⋮ │ │ ☑ Spend Trend (Area) │ │
│ │ │ │ ☑ Top Campaigns (Bar) │ │
│ │ ☑ Appendix │ │ │ │
│ │ ⋮⋮ │ │ + Add Chart │ │
│ │ │ │ │ │
│ │ [+ Add Section]│ │ │ │
│ │ │ │ │ │
│ └─────────────────┘ └───────────────────────────┘ │
│ │
================================================================
```

---

## 11. Report Preview / PDF Viewer

```
================================================================
← Back to Client Acme Corp — August 2026 Report
[Download PDF] [Share] [Print] [Fullscreen]
----------------------------------------------------------------
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ │ │ │
│ │ │ COVER PAGE │ │ │
│ │ │ │ │ │
│ │ │ [Agency Logo] │ │ │
│ │ │ │ │ │
│ │ │ MONTHLY PERFORMANCE REPORT │ │ │
│ │ │ │ │ │
│ │ │ Acme Corp │ │ │
│ │ │ August 1 – 31, 2026 │ │ │
│ │ │ │ │ │
│ │ │ Prepared by Acme Digital │ │ │
│ │ │ September 1, 2026 │ │ │
│ │ │ │ │ │
│ │ └─────────────────────────────────────┘ │ │
│ │ │ │
│ │ │ │
│ │ Page 1 of 12 │ │
│ │ │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ ◀ 1 2 3 4 5 ... 12 ▶ │
│ │
│ Zoom: [100%] [Fit Width] [Fit Page] │
│ │
================================================================
```

---

## 12. Template Gallery

```
================================================================
Templates [+ Create Template]│
----------------------------------------------------------------
│ │
│ Filter: [All Templates ▼] Search: [...........] │
│ │
│ ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐
│ │ Default Report │ │ Executive │ │ Social Media │
│ │ │ │ Summary │ │ Focus │
│ │ ┌─────────────┐ │ │ │ │ │
│ │ │ │ │ │ ┌─────────────┐ │ │ ┌───────────┐ │
│ │ │ [Template │ │ │ │ │ │ │ │ │ │
│ │ │ Preview │ │ │ │ [Template │ │ │ │ [Template │ │
│ │ │ Thumb] │ │ │ │ Preview │ │ │ │ Preview │ │
│ │ │ │ │ │ │ Thumb] │ │ │ │ Thumb] │ │
│ │ └─────────────┘ │ │ │ │ │ │ │ │ │
│ │ │ │ └─────────────┘ │ │ └───────────┘ │
│ │ Default │ │ │ │ │
│ │ 8 sections │ │ Executive │ │ Social Media │
│ │ Agency brand │ │ 5 sections │ │ 6 sections │
│ │ │ │ Agency brand │ │ Agency brand │
│ │ [Edit] [Use] │ │ │ │ │
│ │ │ │ [Edit] [Use] │ │ [Edit] [Use] │
│ └─────────────────┘ └─────────────────┘ └────────────────┘
│ │
│ ┌─────────────────┐ ┌─────────────────────────┐ │
│ │ SEO Deep Dive │ │ + Create New Template │ │
│ │ │ │ │ │
│ │ ┌─────────────┐ │ │ [dashed border, │ │
│ │ │ │ │ │ plus icon] │ │
│ │ │ [Template │ │ │ │ │
│ │ │ Preview │ │ │ Build a custom │ │
│ │ │ Thumb] │ │ │ report template │ │
│ │ │ │ │ │ for your agency │ │
│ │ └─────────────┘ │ │ │ │
│ │ │ │ │ │
│ │ SEO Deep Dive │ │ │ │
│ │ 10 sections │ │ │ │
│ │ Agency brand │ │ │ │
│ │ │ │ │ │
│ │ [Edit] [Use] │ │ │ │
│ └─────────────────┘ └─────────────────────────┘ │
│ │
│ Showing 1-4 of 4 templates │
│ │
================================================================
```

---

## 13. Template Editor

```
================================================================
← Templates Template Editor: Default Report [Save]│
----------------------------------------------------------------
│ │
│ Template Name: [Default Report ] │
│ │
│ ┌──────────────────┐ ┌────────────────────────┐ │
│ │ │ │ Section Configuration │ │
│ │ Page Layout │ │ │ │
│ │ │ │ Selected: Executive │ │
│ │ ┌────────────┐ │ │ Summary │ │
│ │ │ │ │ │ │ │
│ │ │ ┌──────┐ │ │ │ Title: │ │
│ │ │ │Cover │ │ │ │ [Executive Summary ] │ │
│ │ │ │Page │ │ │ │ │ │
│ │ │ ├──────┤ │ │ │ AI Narrative: ☑ Yes │ │
│ │ │ │ │ │ │ │ ☐ No │ │
│ │ │ │Body │ │ │ │ │ │
│ │ │ │ │ │ │ │ Tone: [Professional ▼] │ │
│ │ │ │ │ │ │ │ ☐ Casual │ │
│ │ │ │ │ │ │ │ ☐ Technical │ │
│ │ │ │ │ │ │ │ ☐ Executive │ │
│ │ │ ├──────┤ │ │ │ │ │
│ │ │ │ │ │ │ │ Length: [3 bullets ▼] │ │
│ │ │ │More │ │ │ │ ☐ 3 bullets │ │
│ │ │ │Body │ │ │ │ ☐ 1 paragraph │ │
│ │ │ │ │ │ │ │ ☐ Detailed │ │
│ │ │ │ │ │ │ │ │ │
│ │ │ ├──────┤ │ │ │ Include Comparisons: │ │
│ │ │ │ │ │ │ │ ☑ MoM (Month-over-Mo.) │ │
│ │ │ │Foot │ │ │ │ ☑ YoY (Year-over-Year) │ │
│ │ │ │ │ │ │ │ ☐ QoQ │ │
│ │ │ └──────┘ │ │ │ │ │
│ │ │ │ │ │ Charts to Include: │ │
│ │ │ Page: A4 │ │ │ ☑ Spend Trend (Area) │ │
│ │ │ Portrait ○ │ │ │ ☑ Channel Mix (Pie) │ │
│ │ │ Landscape ● │ │ │ ☐ Top Campaigns (Bar) │ │
│ │ │ │ │ │ │ │
│ │ │ Margins: │ │ │ [+ Add Chart] │ │
│ │ │ Top: [20] │ │ │ │ │
│ │ │ Bottom:[20]│ │ │ │ │
│ │ │ Left: [15] │ │ │ │ │
│ │ │ Right:[15] │ │ │ │ │
│ │ └────────────┘ │ └────────────────────────┘ │
│ │ │ │
│ │ Brand Elements: │ │
│ │ ☑ Header │ │
│ │ ☑ Footer │ │
│ │ ☑ Page Numbers │ │
│ │ ☑ Brand Colors │ │
│ │ │ │
│ └──────────────────┘ │
│ │
================================================================
```

---

## 14. Billing Page

```
================================================================
AGENCYPULSE [🔍 Search...] 🔔(3) 👤 Sarah Johnson ▼
----------------------------------------------------------------
│ 🏠 Dashboard 📋 Clients 📊 Reports 📑 Templates 🔌 ... │
| ⚙️ Settings 💳 Billing [Collapse] │
----------------------------------------------------------------
│ │
│ Billing & Subscription │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Current Plan: Agency │ │
│ │ ──────────────────────── │ │
│ │ $149/month │ │
│ │ │ │
│ │ Renews: October 6, 2026 [Change Plan]│ │
│ │ Next invoice: $149.00 │ │
│ │ Billing cycle: Monthly │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Usage This Billing Cycle (Sep 1 – Sep 30) │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │ 67/100 │ │ 234/∞ │ │ 12/10 │ │ 89% │ │
│ │Clients │ │Reports │ │ Team │ │Storage │ │
│ │ ██████░│ │ ████░░ │ │ ██████░│ │ ██████░│ │
│ └────────┘ └────────┘ └────────┘ └────────┘ │
│ │
│ Payment Method │
│ ┌─────────────────────────────────────────────┐ │
│ │ 💳 Visa ending in 4242 Expires 12/27 │ │
│ │ Billing address: 123 Main St, NY │ │
│ │ [Update Payment] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Invoice History │
│ ┌─────────────────────────────────────────────┐ │
│ │ Sep 2026 $149.00 Paid [Download PDF] │ │
│ │ Aug 2026 $149.00 Paid [Download PDF] │ │
│ │ Jul 2026 $149.00 Paid [Download PDF] │ │
│ │ Jun 2026 $149.00 Paid [Download PDF] │ │
│ │ May 2026 $149.00 Paid [Download PDF] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Plans & Pricing │
│ ┌─────────────────────────────────────────────┐ │
│ │ Compare all plans → │ │
│ │ Need more? Contact sales for Enterprise → │ │
│ └─────────────────────────────────────────────┘ │
│ │
================================================================
```

---

## 15. Settings — Agency

```
================================================================
AGENCYPULSE [🔍 Search...] 🔔(3) 👤 Sarah Johnson ▼
----------------------------------------------------------------
│ 🏠 Dashboard 📋 Clients 📊 Reports 📑 Templates 🔌 ... │
| ⚙️ Settings 💳 Billing [Collapse] |
----------------------------------------------------------------
│ Settings [Agency] [Team] [Billing]│
│ │
│ Agency Information │
│ ┌─────────────────────────────────────────────┐ │
│ │ Agency Name: │ │
│ │ [Acme Digital Marketing ] │ │
│ │ │ │
│ │ Industry: │ │
│ │ [Digital Marketing Agency ▼] │ │
│ │ │ │
│ │ Timezone: │ │
│ │ [America/New_York (EST) ▼] │ │
│ │ │ │
│ │ Website: │ │
│ │ [https://acmedigital.com ] │ │
│ │ │ │
│ │ [Save Changes] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Default Report Settings │
│ ┌─────────────────────────────────────────────┐ │
│ │ Default Template: │ │
│ │ [Default Report ▼] │ │
│ │ │ │
│ │ Default Frequency: │ │
│ │ [Monthly ▼] │ │
│ │ │ │
│ │ Default Sender Name: │ │
│ │ [Acme Digital Team ] │ │
│ │ │ │
│ │ Default Reply-To: │ │
│ │ [reports@acmedigital.com ] │ │
│ │ │ │
│ │ [Save Settings] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Organization ID │
│ org_1a2b3c4d5e6f7g8h9i0j │
│ │
│ Data & Privacy │
│ [Export All Data] [Request Data Deletion] │
│ │
================================================================
```

---

## 16. Settings — Branding

```
================================================================
AGENCYPULSE [🔍 Search...] 🔔(3) 👤 Sarah Johnson ▼
----------------------------------------------------------------
│ 🏠 Dashboard 📋 Clients 📊 Reports 📑 Templates 🔌 ... │
| ⚙️ Settings 💳 Billing [Collapse] │
----------------------------------------------------------------
│ Settings [Agency] [Team] [Billing]│
│ │
│ Agency Branding (Applied to all clients) │
│ ┌─────────────────────────────────────────────┐ │
│ │ Agency Logo: │ │
│ │ │ │
│ │ ┌──────────┐ │ │
│ │ │ │ [Upload Logo] │ │
│ │ │ [Logo │ PNG, SVG up to 2MB │ │
│ │ │ Image] │ │ │
│ │ │ │ [Remove] │ │
│ │ └──────────┘ │ │
│ │ │ │
│ │ Logo Placement: │ │
│ │ ☑ Cover Page ☑ Report Header ☑ Footer │ │
│ │ │ │
│ │ Primary Color: │ │
│ │ [ #8B5CF6 ■ ] │ │
│ │ ○ ● ○ ● ○ ● ○ ● (color swatches) │ │
│ │ │ │
│ │ Secondary Color: │ │
│ │ [ #7C3AED ■ ] │ │
│ │ │ │
│ │ Accent Color: │ │
│ │ [ #10B981 ■ ] │ │
│ │ │ │
│ │ Font Family: │ │
│ │ [Inter ▼] │ │
│ │ ☐ Poppins ☐ Inter ☐ Roboto ☐ Lato │ │
│ │ │ │
│ │ Custom Footer Text: │ │
│ │ [ ] │ │
│ │ [ ] │ │
│ │ │ │
│ │ [Save Branding] │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Preview │
│ ┌─────────────────────────────────────────────┐ │
│ │ ┌───────────────────────────────────────┐ │ │
│ │ │ │ │ │
│ │ │ [Logo] Sample Title │ │ │
│ │ │ │ │ │
│ │ │ Body text in Inter font │ │ │
│ │ │ with #8B5CF6 accent color. │ │ │
│ │ │ │ │ │
│ │ │ [Button] │ │ │
│ │ │ │ │ │
│ │ │ Footer: Acme Digital © 2026 │ │ │
│ │ └───────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Brand Presets (for different clients) │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│ │ Default │ │ TechCo │ │ + New Preset │ │
│ │ [Preview] │ │[Preview] │ │ │ │
│ │ Purple │ │ Blue │ │ [dashed │ │
│ │ theme │ │ theme │ │ border] │ │
│ │ [Use] │ │ [Use] │ │ │ │
│ └──────────┘ └──────────┘ └──────────────┘ │
│ │
================================================================
```

---

## 17. Settings — Team

```
================================================================
AGENCYPULSE [🔍 Search...] 🔔(3) 👤 Sarah Johnson ▼
----------------------------------------------------------------
│ 🏠 Dashboard 📋 Clients 📊 Reports 📑 Templates 🔌 ... │
| ⚙️ Settings 💳 Billing [Collapse] │
----------------------------------------------------------------
│ Settings [Agency] [Team] [Billing]│
│ │
│ Team Members [+ Invite] │
│ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 👤 Sarah Johnson Admin │ │
│ │ sarah@acmedigital.com Active │ │
│ │ Joined Aug 2026 ···│ │
│ ├─────────────────────────────────────────────┤ │
│ │ 👤 Mike Chen Manager │ │
│ │ mike@acmedigital.com Active │ │
│ │ Joined Aug 2026 ···│ │
│ ├─────────────────────────────────────────────┤ │
│ │ 👤 Alex Rivera Viewer │ │
│ │ alex@acmedigital.com Pending │ │
│ │ Invited Sep 1, 2026 ···│ │
│ ├─────────────────────────────────────────────┤ │
│ │ 👤 Jordan Lee Manager │ │
│ │ jordan@acmedigital.com Active │ │
│ │ Joined Jul 2026 ···│ │
│ └─────────────────────────────────────────────┘ │
│ │
│ Roles & Permissions │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ │ Admin │ │ Manager │ │ Viewer │
│ │ │ │ │ │ │
│ │ ✓ Full access│ │ ✓ Manage │ │ ✓ View only │
│ │ ✓ Manage │ │ clients │ │ ✓ Download │
│ │ billing │ │ ✓ Generate │ │ reports │
│ │ ✓ Invite │ │ reports │ │ ✗ Edit data │
│ │ team │ │ ✓ Edit │ │ ✗ Manage │
│ │ ✓ Delete │ │ reports │ │ team │
│ │ org │ │ ✗ Billing │ │ ✗ Billing │
│ └──────────────┘ └──────────────┘ └──────────────┘
│ │
│ Invite Team Member │
│ ┌─────────────────────────────────────────────┐ │
│ │ Email: [ ] │ │
│ │ Role: [Manager ▼] │ │
│ │ │ │
│ │ [Send Invitation] │ │
│ └─────────────────────────────────────────────┘ │
│ │
================================================================
```

---

## 18. Onboarding Wizard

```
================================================================
AGENCYPULSE — Let's set up your agency
----------------------------------------------------------------
│ │
│ Step 1 of 4 │
│ ●────────── │
│ │
│ Organization Setup │
│ │
│ Tell us about your agency │
│ │
│ Agency Name: │
│ ┌────────────────────────────────────────────┐ │
│ │ Acme Digital Marketing │ │
│ └────────────────────────────────────────────┘ │
│ │
│ Industry: │
│ ┌────────────────────────────────────────────┐ │
│ │ Digital Marketing Agency [▼] │ │
│ └────────────────────────────────────────────┘ │
│ │
│ Timezone: │
│ ┌────────────────────────────────────────────┐ │
│ │ America/New_York (EST) [▼] │ │
│ └────────────────────────────────────────────┘ │
│ │
│ Website (optional): │
│ ┌────────────────────────────────────────────┐ │
│ │ https://acmedigital.com │ │
│ └────────────────────────────────────────────┘ │
│ │
│ │
│ [Back] [Next →]│
│ │
================================================================
```

```
================================================================
AGENCYPULSE — Let's set up your agency
----------------------------------------------------------------
│ │
│ Step 2 of 4 │
│ ─●───────── │
│ │
│ Brand Setup │
│ │
│ Make your reports look like they came from you │
│ │
│ Agency Logo: │
│ ┌──────────┐ │
│ │ │ [Upload Logo] │
│ │ [Drop │ Drag & drop or click to upload │
│ │ zone] │ PNG, SVG, JPG up to 2MB │
│ │ │ │
│ └──────────┘ [Remove] │
│ │
│ Brand Colors: │
│ │
│ Primary: [ #8B5CF6 ■ ] │
│ ○ ● ○ ● ○ ● ○ (preset swatches) │
│ │
│ Secondary: [ #7C3AED ■ ] │
│ │
│ Font: │
│ ☑ Inter ☐ Poppins ☐ Roboto ☐ Lato │
│ │
│ Preview: │
│ ┌──────────────────────────────────────────┐ │
│ │ [Logo] Sample Report Title │ │
│ │ Purple #8B5CF6 accent │ │
│ └──────────────────────────────────────────┘ │
│ │
│ [Back] [Next →]│
│ │
================================================================
```

```
================================================================
AGENCYPULSE — Let's set up your agency
----------------------------------------------------------------
│ │
│ Step 3 of 4 │
│ ──────●────── │
│ │
│ Choose Your Plan │
│ │
│ ┌───────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Starter │ │ Growth │ │ Agency │ │
│ │ $29/mo │ │ $79/mo │ │ $149/mo │ │
│ │ │ │ │ │ │ │
│ │ 5 clients │ │ 25 clients │ │ 100 clients│ │
│ │ 25 reports│ │ 100 reports│ │ Unlimited │ │
│ │ Basic │ │ AI recs │ │ AI + Portal│ │
│ │ │ │ │ │ │ │
│ │ [Select] │ │ [Select] │ │ [Select] │ │
│ └───────────┘ └────────────┘ └────────────┘ │
│ │
│ Compare features ▾ │
│ │
│ [Back] [Next →]│
│ │
================================================================
```

```
================================================================
AGENCYPULSE — Let's set up your agency
----------------------------------------------------------------
│ │
│ Step 4 of 4 │
│ ────────────● │
│ │
│ Add Your First Client │
│ │
│ Let's get your first client set up so you can │
│ start generating reports. │
│ │
│ Client Name: │
│ ┌────────────────────────────────────────────┐ │
│ │ Acme Corp │ │
│ └────────────────────────────────────────────┘ │
│ │
│ Industry: │
│ ┌────────────────────────────────────────────┐ │
│ │ Technology [▼] │ │
│ └────────────────────────────────────────────┘ │
│ │
│ Contact Email: │
│ ┌────────────────────────────────────────────┐ │
│ │ john@acmecorp.com │ │
│ └────────────────────────────────────────────┘ │
│ │
│ Connect Data Sources: │
│ ☑ Google Ads ☑ Meta Ads ☐ GA4 │
│ │
│ (You can connect more sources later) │
│ │
│ [Back] [Finish]│
│ │
│ │
│ Skip for now → │
│ │
================================================================
```

---

## 19. Mobile Adaptations

### Mobile: Dashboard

```
┌─────────────────────────────┐
│ ☰ AGENCYPULSE 👤 ▼ │
├─────────────────────────────┤
│ │
│ Dashboard │
│ │
│ Clients (42) │
│ Reports (156) │
│ Open Rate (94%) │
│ Avg Sync (2.4h) │
│ │
│ Recent Reports [+ New] │
│ ┌─────────────────────────┐│
│ │ Acme Corp Aug Sent › ││
│ │ Beta Inc Aug Draft › ││
│ │ Gamma LLC Aug Sent › ││
│ └─────────────────────────┘│
│ │
│ [+ Add Client] │
│ [⚡ Generate All] │
│ [🔄 Sync All] │
│ │
└─────────────────────────────┘
```

### Mobile: Client List

```
┌─────────────────────────────┐
│ ← Clients [+ Add] │
├─────────────────────────────┤
│ 🔍 Search... │
│ │
│ ┌─────────────────────────┐ │
│ │ Acme Corp │ │
│ │ 🟢 G 🟢 M 🟢 GA4 │ │
│ │ Last: Aug Sent $4k › │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Beta Inc │ │
│ │ 🟢 G 🔴 M 🟢 GA4 │ │
│ │ Last: Aug Draft $2k › │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Gamma LLC │ │
│ │ 🟡 G 🟢 M 🟢 GA4 │ │
│ │ Last: Aug Sent $8k › │ │
│ └─────────────────────────┘ │
│ │
│ Showing 1-3 of 42 │
│ [← Prev] 1 2 3...7 [Next →]│
└─────────────────────────────┘
```

### Mobile: Client Detail

```
┌─────────────────────────────┐
│ ← Acme Corp [Generate] [·]│
├─────────────────────────────┤
│ [Overview] [Integrations] │
│ [Reports] [KPIs] │
├─────────────────────────────┤
│ │
│ Key Metrics │
│ ┌───────┐ ┌───────┐ │
│ │$45,230│ │ 12.4% │ │
│ │Spend │ │ CTR │ │
│ └───────┘ └───────┘ │
│ ┌───────┐ ┌───────┐ │
│ │ 3.2x │ │1,847 │ │
│ │ ROAS │ │ Conv. │ │
│ └───────┘ └───────┘ │
│ │
│ Spend Over Time │
│ ┌─────────────────────────┐│
│ │ /\ ││
│ │ / \ ││
│ │ / \ /\ ││
│ │ / \/ \ ││
│ │/ \ ││
│ └─────────────────────────┘│
│ │
│ Recent Reports │
│ Aug 2026 ✓ Sent [View] │
│ Jul 2026 ✓ Sent [View] │
│ Jun 2026 ✓ Sent [View] │
│ │
└─────────────────────────────┘
```

### Mobile: Report Builder

```
┌─────────────────────────────┐
│ ← Report Builder [Preview] │
├─────────────────────────────┤
│ Client: [Acme Corp ▼] │
│ Period: [Aug 2026 ▼] │
├─────────────────────────────┤
│ │
│ Report Sections │
│ ┌─────────────────────────┐ │
│ │ ☑ Cover Page ⋮ │ │
│ │ ☑ Executive Summary ⋮ │ │
│ │ ☑ Google Ads ⋮ │ │
│ │ ☑ Meta Ads ⋮ │ │
│ │ ☑ GA4 ⋮ │ │
│ │ ☑ Highlights ⋮ │ │
│ │ ☑ Recommendations ⋮ │ │
│ │ ☑ Appendix ⋮ │ │
│ │ [+ Add Section] │ │
│ └─────────────────────────┘ │
│ │
│ ┌─────────────────────────┐ │
│ │ Executive Summary │ │
│ │ │ │
│ │ AI-generated narrative │ │
│ │ text appears here with │ │
│ │ inline editing support. │ │
│ │ │ │
│ │ Tap to edit... │ │
│ │ │ │
│ │ [Regenerate AI] 142/200 │ │
│ └─────────────────────────┘ │
│ │
└─────────────────────────────┘
```

---

## Appendix: Breakpoint Reference

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| `xs` | < 640px | Single column, stacked layout, hamburger nav |
| `sm` | 640px+ | 2-column grids, compact sidebar |
| `md` | 768px+ | Sidebar visible, 3-column grids |
| `lg` | 1024px+ | Full sidebar, 4-column KPI grid, table view |
| `xl` | 1280px+ | Max-width containers, comfortable spacing |
| `2xl` | 1536px+ | Wider content areas, additional columns |

## Appendix: Component Spacing Reference

```
Card (default):
┌──────────────────────────────┐ padding: 24px
│ Title │ border-radius: 12px
│ │ border: 1px solid #E2E8F0
│ Content area │
│ with 16px inner spacing │
│ │
└──────────────────────────────┘

Card (compact):
┌──────────────────────────┐ padding: 16px
│ Title │ border-radius: 8px
│ Content │ border: 1px solid #E2E8F0
└──────────────────────────┘

Section spacing:
┌──────────────────────────────┐
│ Section Title │ margin-bottom: 24px
│ ┌────────────────────────┐ │
│ │ Card content │ │
│ └────────────────────────┘ │
│ │
│ gap to next section: 32px │
└──────────────────────────────┘

Form field spacing:
┌──────────────────────────────┐
│ Label │ margin-bottom: 6px
│ ┌────────────────────────┐ │
│ │ Input field │ │ height: 40px
│ └────────────────────────┘ │
│ Hint text │ margin-top: 4px
│ │
│ gap to next field: 20px │
└──────────────────────────────┘
```
