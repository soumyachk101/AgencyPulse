# AgencyPulse — UI/UX Design Documentation

**Version:** 1.0
**Date:** 2026-09-06

This document covers the complete design system, page layouts, and visual guidelines for AgencyPulse.

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Landing Page](#2-landing-page)
3. [Agency Dashboard](#3-agency-dashboard)
4. [Client Detail Page](#4-client-detail-page)
5. [Report Builder / Editor](#5-report-builder--editor)
6. [Report Viewer (PDF)](#6-report-viewer-pdf)
7. [Template Editor](#7-template-editor)
8. [Settings Pages](#8-settings-pages)
9. [Dark Mode](#9-dark-mode)
10. [Data Visualization Guidelines](#10-data-visualization-guidelines)

---

## 1. Design System

### 1.1 Color Palette

#### Primary Brand Colors

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Purple | `#8B5CF6` | CTAs, active states, brand elements, links |
| Primary Hover | Purple Dark | `#7C3AED` | Button hover, link hover |
| Primary Light | Purple Tint | `#EDE9FE` | Light backgrounds, hover states |
| Primary 50 | Very Light | `#F5F3FF` | Subtle backgrounds |

#### Semantic Colors

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Success | Green | `#10B981` | Positive metrics, connected status, success messages |
| Warning | Amber | `#F59E0B` | Caution states, syncing status, warnings |
| Error | Red | `#EF4444` | Failed sync, errors, destructive actions |
| Info | Blue | `#3B82F6` | Informational badges, tips, neutral alerts |

#### Neutral / Grayscale

| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Background (page) | `#FFFFFF` | `#0F172A` |
| Background (elevated) | `#F8FAFC` | `#1E293B` |
| Background (subtle) | `#F1F5F9` | `#334155` |
| Border | `#E2E8F0` | `#475569` |
| Border (subtle) | `#F1F5F9` | `#334155` |
| Text (primary) | `#0F172A` | `#F8FAFC` |
| Text (secondary) | `#475569` | `#94A3B8` |
| Text (muted) | `#94A3B8` | `#64748B` |
| Text (inverse) | `#FFFFFF` | `#0F172A` |

#### Status Colors (Metrics)

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| Positive Trend | Green | `#10B981` | Metric up, good performance |
| Negative Trend | Red | `#EF4444` | Metric down, poor performance |
| Neutral Trend | Gray | `#94A3B8` | Flat / no change |
| Target Met | Green | `#10B981` | KPI within target range |
| Target Miss | Red | `#EF4444` | KPI below target |
| Target At Risk | Amber | `#F59E0B` | KPI approaching threshold |

### 1.2 Typography

#### Font Stack

```css
/* Primary: Inter (UI, body, headings) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace: JetBrains Mono (code, metrics) */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;

/* Brand: Poppins (headings, report titles) */
--font-brand: 'Poppins', 'Inter', sans-serif;
```

#### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 400 | 1.5 | Captions, labels, timestamps |
| `text-sm` | 0.875rem (14px) | 400 | 1.5 | Secondary text, helper text |
| `text-base` | 1rem (16px) | 400 | 1.6 | Body text, input fields |
| `text-lg` | 1.125rem (18px) | 500 | 1.5 | Card titles, section headings |
| `text-xl` | 1.25rem (20px) | 600 | 1.4 | Page headings |
| `text-2xl` | 1.5rem (24px) | 600 | 1.3 | Dashboard section titles |
| `text-3xl` | 1.875rem (30px) | 700 | 1.2 | Hero headings, report titles |
| `text-4xl` | 2.25rem (36px) | 700 | 1.1 | Landing page hero |

### 1.3 Spacing

Uses a consistent 4px base grid (Tailwind default):

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight spacing, icon gaps |
| `2` | 8px | Small gaps, padding |
| `3` | 12px | Compact padding |
| `4` | 16px | Standard padding, card padding |
| `5` | 20px | Medium spacing |
| `6` | 24px | Section spacing |
| `8` | 32px | Card gaps, form sections |
| `10` | 40px | Large gaps |
| `12` | 48px | Section dividers |
| `16` | 64px | Page-level spacing |

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, small elements |
| `rounded-md` | 6px | Buttons, inputs, cards |
| `rounded-lg` | 8px | Cards, modals, panels |
| `rounded-xl` | 12px | Large cards, dropdowns |
| `rounded-2xl` | 16px | Hero sections, prominent cards |
| `rounded-full` | 9999px | Pills, avatars, circular elements |

### 1.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards, dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals, side panels |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Large overlays |
| `shadow-purple` | `0 4px 14px 0 rgba(139,92,246,0.4)` | Primary CTAs |

### 1.6 Icons

- **Icon library:** Lucide React (consistent with shadcn/ui)
- **Size convention:** `h-4 w-4` (16px) for inline, `h-5 w-5` (20px) for buttons, `h-6 w-6` (24px) for prominent
- **Stroke width:** 2px default, 1.5px for dense UI

### 1.7 Motion & Animation

| Interaction | Duration | Easing | Usage |
|-------------|----------|--------|-------|
| Hover (buttons, links) | 150ms | ease-out | Color transitions |
| Modal open/close | 200ms | ease-out | Fade + slide |
| Dropdown open | 150ms | ease-out | Fade + scale |
| Page transitions | 300ms | ease-in-out | Route changes |
| Loading skeletons | 1.5s | ease-in-out | Shimmer pulse |
| Chart animations | 500ms | ease-out | Data loading |
| Toast notifications | 300ms in / 300ms out | ease-out | Slide + fade |

---

## 2. Landing Page

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│ [Logo] AgencyPulse [Features] [Pricing] [Sign In]│ ← Navbar (sticky)
├──────────────────────────────────────────────────────────┤
│ │
│ Turn Hours of Reporting Into │ ← Hero Section
│ One-Click Narrative PDFs │
│ │
│ [Input: Email] [→ Get Started Free] │
│ │
│ Trusted by 200+ agencies │ ← Social Proof
│ [Logo] [Logo] [Logo] [Logo] │
│ │
├──────────────────────────────────────────────────────────┤
│ │
│ ┌──────┐ ┌──────┐ ┌──────┐ │ ← Feature Cards
│ │ Auto │ │ White│ │ AI │ │
│ │ Sync │ │Label │ │Insights│ │
│ └──────┘ └──────┘ └──────┘ │
│ │
├──────────────────────────────────────────────────────────┤
│ │
│ How It Works │ ← Steps Section
│ ① Connect → ② Configure → 3 Deliver │
│ │
├──────────────────────────────────────────────────────────┤
│ │
│ Pricing │ ← Pricing Table
│ Starter $29 | Growth $79 | Agency $149 │
│ │
├──────────────────────────────────────────────────────────┤
│ │
│ [CTA: Start Free Trial] │ ← Final CTA
│ │
├──────────────────────────────────────────────────────────┤
│ © 2026 AgencyPulse | Terms | Privacy │ ← Footer
└──────────────────────────────────────────────────────────┘
```

### Design Specifications

**Navbar:**
- Height: 64px
- Background: transparent on hero, white with blur on scroll
- Logo: left-aligned, Poppins font, purple `#8B5CF6` dot accent
- Nav links: 14px, 500 weight, gray-600, hover purple
- CTA button: purple filled, "Start Free Trial"
- Mobile: hamburger menu, slide-in drawer

**Hero:**
- Full viewport height minus navbar
- Background: subtle gradient from `#F5F3FF` to white, with a decorative purple glow/blur orb in the top-right
- Heading: Poppins 48px, bold, dark text, max-width 700px
- Subheading: Inter 18px, gray-600, max-width 560px
- Input + button: centered, max-width 480px, input with 16px border radius, purple button
- Social proof: 32px grayscale logos, opacity 0.6, centered

**Feature Cards (3-column grid):**
- Background: white cards on `#F8FAFC` page background
- Card padding: 32px
- Border: 1px `#E2E8F0`, radius 12px
- Icon: 48px, purple background circle with white icon
- Title: 18px, 600 weight, dark
- Description: 14px, gray-600, 1.6 line-height
- Hover: translateY(-4px), shadow-lg transition

**Pricing Table:**
- 3-column layout, equal width
- Highlighted plan (Growth): purple border, elevated shadow, "Most Popular" badge
- Each card: title, price, feature list with checkmarks, CTA button
- Toggle: Monthly / Annual with savings badge

**Footer:**
- 4 columns: Product, Company, Resources, Legal
- Background: `#0F172A` (dark)
- Text: gray-400 for links, gray-300 for headings

---

## 3. Agency Dashboard

### Layout Structure

```
┌─────────┬───────────────────────────────────────────────────┐
│ Sidebar │ Top Bar │
│ 240px │ ┌─────────────────────────────────────────────┐ │
│ │ │ [Search...] 🔔 👤 Agency Admin │ │
│ 🏠 Dash │ ├─────────────────────────────────────────────┤ │
│ 📋 Clients│ │
│ 📊 Reports│ Page Heading │
│ 📑 Templates│ │
│ 🔌 Integrations│ Main Content Area │
│ ⚙️ Settings│ │
│ 💳 Billing│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │ │ 42 │ │ 156 │ │ 94% │ │ 2.4h │ │
│ │ │Clients │ │Reports │ │Open Rt │ │Avg Sync│ │ ← KPI Cards
│ │ └────────┘ └────────┘ └────────┘ └────────┘ │
│ │ │
│ │ Recent Reports [+ New Report] │ ← Table
│ │ ┌─────────────────────────────────────────────┐ │
│ │ │ Client │ Period │ Status │ Date │Act│ │
│ │ ├─────────────────────────────────────────────┤ │
│ │ │ Acme Corp │ Aug 2026│ Sent │ Sep 1 │⋯ │ │
│ │ │ Beta Inc │ Aug 2026│ Draft │ Sep 2 │⋯ │ │
│ │ │ Gamma LLC │ Aug 2026│ Sent │ Sep 1 │⋯ │ │
│ │ └─────────────────────────────────────────────┘ │
│ │ │
│ │ Quick Actions │
│ │ [+ Add Client] [⚡ Generate All Reports] [🔄 Sync]│
└─────────┴───────────────────────────────────────────────────┘
```

### Design Specifications

**Sidebar:**
- Width: 240px (collapsed: 64px on toggle)
- Background: white (`#FFFFFF`) with right border `#E2E8F0`
- Active item: purple left border (3px), `#F5F3FF` background
- Icon + label: 14px, 500 weight, gray-700
- Logo at top: AgencyPulse with purple dot, Poppins 18px
- User section at bottom: avatar, name, role

**Top Bar:**
- Height: 64px
- Background: white, bottom border `#E2E8F0`
- Search input: max-width 320px, 16px padding, `#F1F5F9` background
- Notification bell: badge with count
- User dropdown: avatar + name, click opens dropdown

**KPI Cards (4-column grid):**
- Background: white, 1px border `#E2E8F0`, radius 12px
- Padding: 24px
- Label: 12px, 500 weight, gray-500, uppercase, tracking-wide
- Value: 32px, 700 weight, dark
- Trend: 14px with arrow icon (green up / red down)
- Subtle icon in top-right corner

**Recent Reports Table:**
- Full width, white background, border radius 12px
- Header row: `#F8FAFC` background, 12px uppercase gray-500
- Row hover: `#F5F3FF` background
- Status badges:
 - Sent: green bg `#ECFDF5`, green text `#065F46`
 - Draft: amber bg `#FFFBEB`, amber text `#92400E`
 - Failed: red bg `#FEF2F2`, red text `#991B1B`
 - Scheduled: blue bg `#EFF6FF`, blue text `#1E40AF`
- Action menu: 3-dot kebab menu per row

**Quick Actions:**
- Horizontal row of action buttons
- Primary: purple filled
- Secondary: outlined gray
- Tertiary: ghost (icon only)

---

## 4. Client Detail Page

### Layout Structure

```
┌─────────┬───────────────────────────────────────────────────────────┐
│ Sidebar │ ← Back to Clients Acme Corp [Generate Report]│
│ │ ┌───────────────────────────────────────────────────────┐ │
│ │ │ [Overview] [Integrations] [Reports] [KPIs] [Settings]│ │
│ │ ├───────────────────────────────────────────────────────┤ │
│ │ │ │ │
│ │ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │ │
│ │ │ │ $45,230 │ │ 12.4% │ │ 3.2x │ │ 1,847 │ │ │
│ │ │ │Total Spend│ │ CTR │ │ ROAS │ │ Conv. │ │ │ ← KPIs
│ │ │ └──────────┘ └──────────┘ └──────────┘ └────────┘ │ │
│ │ │ │ │
│ │ │ Spend Over Time │ │ ← Charts
│ │ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ │ [Area Chart: Spend by Channel] │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │
│ │ │ │ │
│ │ │ Performance by Platform │ │
│ │ │ ┌──────────────────┐ ┌──────────────────┐ │ │
│ │ │ │ Google Ads │ │ Meta Ads │ │ │
│ │ │ │ [Mini Chart] │ │ [Mini Chart] │ │ │
│ │ │ │ CTR: 3.2% ↑ │ │ CTR: 2.1% ↓ │ │ │
│ │ │ └──────────────────┘ └──────────────────┘ │ │
│ │ │ ┌──────────────────┐ │ │
│ │ │ │ GA4 │ │ │
│ │ │ │ [Mini Chart] │ │ │
│ │ │ │ Bounce: 42% ↓ │ │ │
│ │ │ └──────────────────┘ │ │
│ │ │ │ │
│ │ │ Recent Reports │ │ ← Reports List
│ │ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ │ Aug 2026 ✓ Sent │ Jul 2026 ✓ Sent │ + New │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │
│ │ │ │ │
│ │ └───────────────────────────────────────────────────────┘ │
└─────────┴───────────────────────────────────────────────────────────┘
```

### Tab-Specific Content

**Overview Tab (default):**
- KPI summary row (4-5 key metrics)
- Main trend chart (area chart, 6-month spend by channel)
- Platform breakdown cards (one per connected integration)
- Recent reports strip (horizontal cards)

**Integrations Tab:**
```
┌──────────────────────────────────────────┐
│ Connected Data Sources │
│ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │Google Ads│ │ Meta Ads│ │ GA4 │ │
│ │ Connected│ │Connected│ │Connected│ │ ← Integration Cards
│ │Synced 2h │ │Synced 4h│ │Synced 1h│ │
│ │ago │ │ago │ │ago │ │
│ │[Settings]│ │[Settings]│ │[Settings]│ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
│ + Connect New Source │
└──────────────────────────────────────────┘
```

**Reports Tab:**
- Report cards in a grid (2-3 columns)
- Each card: thumbnail preview, period, date generated, status badge, action buttons (View, Download, Resend)
- "Generate New Report" card (dashed border, plus icon)

**KPIs Tab:**
- List of custom KPIs with current value, target, trend, status indicator
- Add KPI button
- Each KPI row: name, formula, current value, target, trend arrow, status dot (green/yellow/red), edit/delete actions

**Settings Tab:**
- Branding section (logo, colors, preview)
- Schedule section (frequency, day, time, recipients)
- Template selection dropdown
- Notification preferences

---

## 5. Report Builder / Editor

### Layout Structure

```
┌───────────────────────────────────────────────────────────────────┐
│ ← Back to Client Report Builder [Preview] [Save]│
├───────────────────────────────────────────────────────────────────┤
│ │
│ Client: Acme Corp Period: Aug 1–31, 2026 Template: Default │
│ │
│ ┌────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ │ │ │ │
│ │ Report Sections │ │ Section Editor │ │
│ │ (Drag to reorder) │ │ │ │
│ │ │ │ ┌─────────────────────────┐ │ │
│ │ ☑ Cover Page │ │ │ Section Title │ │ │
│ │ ☑ Executive Summary │ │ │ [Editable text area] │ │ │
│ │ ☑ Channel Breakdown │ │ │ │ │ │
│ │ ☑ Google Ads │ │ │ AI-generated narrative │ │ │
│ │ ☑ Meta Ads │ │ │ with inline editing │ │ │
│ │ ☑ GA4 │ │ │ │ │ │
│ │ ☑ Key Highlights │ │ │ [Regenerate] [Save] │ │ │
│ │ ☑ Recommendations │ │ └─────────────────────────┘ │ │
│ │ ☑ Appendix │ │ │ │
│ │ │ │ ┌─────────────────────────┐ │ │
│ │ [+ Add Section] │ │ │ Chart Configuration │ │ │
│ │ │ │ │ Chart type, metrics, │ │ │
│ │ │ │ │ date range │ │ │
│ │ │ │ └─────────────────────────┘ │ │
│ └────────────────────────┘ └─────────────────────────────────┘ │
│ │
└───────────────────────────────────────────────────────────────────┘
```

### Design Specifications

**Two-panel layout:**
- Left panel (320px): Section list, drag handle, toggle checkboxes
- Right panel: Contextual editor for selected section
- Section items: 48px height, checkbox, title, drag handle (6-dot grid icon)
- Drag and drop: visual placeholder line between items

**Executive Summary Editor:**
- Textarea with 16px font, 1.6 line-height
- AI-generated text shown with subtle purple left border
- Inline edit mode: click to edit, blur to auto-save
- "Regenerate with AI" button (purple outline)
- Character count: "200 words"

**Recommendations Editor:**
- List of recommendation cards
- Each card: priority badge (Critical/High/Medium/Low), text, edit/delete actions, reorder handles
- Add recommendation button
- Priority colors: Critical=red, High=orange, Medium=amber, Low=gray

**Chart Configuration Panel:**
- Chart type selector: bar, line, area, pie (visual icon buttons)
- Metrics multi-select: dropdown with checkboxes
- Date range: preset buttons + custom date picker
- Group by: platform, campaign, time

---

## 6. Report Viewer (PDF)

### Layout Structure

```
┌───────────────────────────────────────────────────────────────────┐
│ ← Back to Client Acme Corp — August 2026 Report │
│ [Download PDF] [Share] [Print] │
├───────────────────────────────────────────────────────────────────┤
│ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ │ │ │
│ │ │ PDF RENDERED PAGE │ │ │
│ │ │ │ │ │
│ │ │ (Full report page with agency branding, │ │ │
│ │ │ charts, narrative text, tables) │ │ │
│ │ │ │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ │ │
│ │ Page 1 of 12 │ │
│ │ ◀ 1 2 3 4 5 ... 12 ▶ │ │
│ │ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
└───────────────────────────────────────────────────────────────────┘
```

### Design Specifications

**PDF Viewer Container:**
- Centered, max-width 900px
- White background, subtle shadow, rounded corners
- Page aspect ratio: A4 proportions (1:1.414)
- 16px gap between pages when scrolling

**Toolbar:**
- Sticky above the viewer
- Actions: Download PDF (primary purple button), Share (opens share modal), Print, Fullscreen
- Zoom controls: 100% / Fit to width / Fit to page

**Page Navigation:**
- Horizontal page scrubber below viewer
- Current page highlighted in purple
- Click page thumbnail to jump

**Share Modal:**
- Generate shareable link with expiry (7 days, 30 days, never)
- Copy link button with confirmation toast
- Revoke link option

---

## 7. Template Editor

### Layout Structure

```
┌───────────────────────────────────────────────────────────────────┐
│ ← Back to Templates Template Editor: Default │
│ [Preview] [Save Template] │
├───────────────────────────────────────────────────────────────────┤
│ │
│ Template Name: [Default Report ] │
│ │
│ ┌────────────────────┐ ┌────────────────────────────────────┐ │
│ │ │ │ │ │
│ │ Page Layout │ │ Section Order │ │
│ │ │ │ │ │
│ │ ┌──────────────┐ │ │ 1. Cover Page ⋮⋮ │ │
│ │ │ │ │ │ 2. Executive Summary ⋮⋮ │ │
│ │ │ [Cover] │ │ │ 3. Google Ads Section ⋮⋮ │ │
│ │ │ Header │ │ │ 4. Meta Ads Section ⋮⋮ │ │
│ │ │ │ │ │ 5. GA4 Section ⋮⋮ │ │
│ │ │ [Content] │ │ │ 6. Key Highlights ⋮⋮ │ │
│ │ │ Body │ │ │ 7. Recommendations ⋮⋮ │ │
│ │ │ │ │ │ 8. Appendix ⋮⋮ │ │
│ │ │ [Footer] │ │ │ │ │
│ │ │ │ │ │ + Add Section │ │
│ │ └──────────────┘ │ │ │ │
│ │ │ └────────────────────────────────────┘ │
│ │ Page Size: A4 │ │
│ │ Orientation: │ Section Configuration │
│ │ ○ Portrait │ ┌────────────────────────────────────┐ │
│ │ ● Landscape │ │ Section: Executive Summary │ │
│ │ │ │ Title: "Executive Summary" │ │
│ │ Margins: │ │ AI Narrative: ☑ Enabled │ │
│ │ Top: 20mm │ │ Tone: [Professional ▼] │ │
│ │ Bottom: 20mm │ │ Max Length: [3 bullets ▼] │ │
│ │ Left: 15mm │ │ Include MoM: ☑ Yes │ │
│ │ Right: 15mm │ │ │ │
│ │ │ │ Charts: │ │
│ │ Brand: │ │ ☑ Spend Trend │ │
│ │ ☑ Header │ │ ☑ Channel Breakdown │ │
│ │ ☑ Footer │ │ ☑ Top Campaigns │ │
│ │ ☑ Page Numbers │ │ │ │
│ │ │ └────────────────────────────────────┘ │
│ └────────────────────┘ │
│ │
└───────────────────────────────────────────────────────────────────┘
```

### Design Specifications

**Two-panel layout:**
- Left panel (400px): Page layout configuration
- Right panel: Section order and configuration

**Section List:**
- Drag handle on left for reordering
- Section name, type icon, and actions (edit, duplicate, delete, visibility toggle)
- Add section dropdown at bottom

**Section Configuration Panel:**
- Appears when a section is selected
- Title input
- AI settings: toggle, tone selector, length selector
- Chart toggles: checkbox per available chart
- Content source: auto (from data) or custom (manual text)

---

## 8. Settings Pages

### 8.1 Agency Settings

```
┌───────────────────────────────────────────────────────────────────┐
│ Settings: Agency │
├───────────────────────────────────────────────────────────────────┤
│ │
│ Agency Information │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Agency Name: [Acme Digital Marketing ] │ │
│ │ Industry: [Digital Marketing ▼] │ │
│ │ Timezone: [America/New_York (EST) ▼] │ │
│ │ Website: [https://acmedigital.com ] │ │
│ │ [Save Changes] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ Default Branding │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Logo: [Upload] [Current Logo Preview] │ │
│ │ Colors: Primary [#8B5CF6] Secondary [#...] │ │
│ │ Font: [Inter ▼] │ │
│ │ [Save Branding] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ Default Report Settings │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Default Template: [Default Report ▼] │ │
│ │ Default Frequency: [Monthly ▼] │ │
│ │ Default Sender Name: [Acme Digital Team] │ │
│ │ Default Reply-To: [reports@acmedigital.com] │ │
│ │ [Save Settings] │ │
│ └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### 8.2 Team Management

```
┌───────────────────────────────────────────────────────────────────┐
│ Settings: Team │
├───────────────────────────────────────────────────────────────────┤
│ │
│ Team Members [+ Invite Member]│
│ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 👤 Sarah Johnson │ Admin │ sarah@acme.com │ Active │ ⋮ │ │
│ │ 👤 Mike Chen │ Manager│ mike@acme.com │ Active │ ⋮ │ │
│ │ 👤 Alex Rivera │ Viewer │ alex@acme.com │ Pending│ ⋮ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ Roles: │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Admin │ │ Manager │ │ Viewer │ │
│ │ Full │ │ Manage │ │ Read-only│ │
│ │ access │ │ clients, │ │ access │ │
│ │ │ │ reports │ │ │ │
│ └──────────┘ └──────────┘ └──────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### 8.3 Billing Page

```
┌───────────────────────────────────────────────────────────────────┐
│ Billing │
├───────────────────────────────────────────────────────────────────┤
│ │
│ Current Plan │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Agency Plan — $149/month │ │
│ │ Renews: Oct 6, 2026 [Change Plan] │ │
│ │ Next invoice: $149.00 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ Usage This Billing Cycle │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │ 67/100 │ │ 234/∞ │ │ 12/10 │ │ 89% │ │
│ │Clients │ │Reports │ │Team │ │Storage │ │
│ └────────┘ └────────┘ └────────┘ └────────┘ │
│ │
│ Payment Method │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 💳 Visa ending in 4242 Expires 12/27 [Update] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ │
│ Invoice History │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Sep 2026 — $149.00 [Download PDF] │ │
│ │ Aug 2026 — $149.00 [Download PDF] │ │
│ │ Jul 2026 — $149.00 [Download PDF] │ │
│ └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

---

## 9. Dark Mode

### Dark Mode Color Application

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page background | `#FFFFFF` | `#0F172A` |
| Elevated surfaces (cards, sidebar) | `#FFFFFF` | `#1E293B` |
| Subtle surfaces (inputs, table rows) | `#F8FAFC` | `#1E293B` |
| Borders | `#E2E8F0` | `#475569` |
| Primary text | `#0F172A` | `#F8FAFC` |
| Secondary text | `#475569` | `#94A3B8` |
| Muted text | `#94A3B8` | `#64748B` |
| Primary brand color | `#8B5CF6` | `#8B5CF6` (unchanged) |
| Primary hover | `#7C3AED` | `#7C3AED` (unchanged) |
| Primary light tint | `#F5F3FF` | `#2D1B69` |
| Success | `#10B981` | `#10B981` (unchanged) |
| Warning | `#F59E0B` | `#F59E0B` (unchanged) |
| Error | `#EF4444` | `#EF4444` (unchanged) |

### Dark Mode Implementation

- **Toggle location:** User dropdown menu + Settings page
- **Persistence:** `localStorage` key `agencypulse-theme` with values `light`, `dark`, `system`
- **System preference:** Default to system `prefers-color-scheme`
- **CSS approach:** Tailwind `dark:` variant classes with `class` strategy
- **Transition:** 200ms ease on background and text color changes
- **PDF Reports:** Always render in light mode (print documents don't support dark mode)

### Dark Mode Considerations

- Reduce shadow intensity in dark mode (use `dark:` variant shadows with lower opacity)
- Increase border contrast slightly for element separation
- Charts: keep grid lines visible (use `#475569` instead of `#E2E8F0`)
- Charts: use lighter data series colors for contrast against dark background
- Code blocks / monospace: use `#1E293B` background with `#E2E8F0` text

---

## 10. Data Visualization Guidelines

### 10.1 Chart Types & Usage

| Chart Type | Best For | Avoid |
|------------|----------|-------|
| **Area Chart** | Trends over time, cumulative data, stacked comparisons | Fewer than 3 data points, categorical data |
| **Line Chart** | Continuous trends, single metric over time, comparisons | Discrete categories, small datasets |
| **Bar Chart** | Comparing discrete categories, campaign performance | Time series with many points |
| **Horizontal Bar** | Ranking items, long labels (campaign names) | Time series |
| **Pie / Donut** | Proportions, channel mix (max 5 segments) | Many segments, precise comparisons |
| **Funnel Chart** | Conversion funnels, multi-step processes | General metrics |
| **Table** | Detailed data, many columns, exact values | Visual trends, high-level overviews |

### 10.2 Chart Design Rules

**Colors:**
- Primary data series: `#8B5CF6` (purple)
- Secondary: `#3B82F6` (blue)
- Tertiary: `#10B981` (green)
- Quaternary: `#F59E0B` (amber)
- Quinary: `#EF4444` (red)
- Neutral / grid: `#E2E8F0` (light) / `#475569` (dark)
- Never use more than 5 colors in a single chart

**Axes:**
- Y-axis: always include grid lines (light, 1px dashed)
- X-axis: time labels formatted with `date-fns` (e.g., "Aug 1", "Aug 8")
- Axis labels: 12px, gray-500
- Tick marks: every 4th tick for daily data, every month for monthly data

**Tooltips:**
- Background: `#0F172A` (dark), white text
- Border radius: 8px
- Padding: 12px 16px
- Font: 13px
- Format: `Label: Value (Change%)`
- Position: centered above cursor, with 8px gap

**Legends:**
- Position: bottom for horizontal layouts, right for vertical
- 13px font, 500 weight
- Color dot (8px circle) + label
- Interactive: click to toggle series visibility

**Animations:**
- Initial render: 500ms ease-out, bars grow from bottom, lines draw from left
- Data update: 300ms transition on new data
- Hover: highlight data point (enlarge dot, show tooltip)
- Never animate on page load if chart is below the fold (use IntersectionObserver)

### 10.3 Metric Display Guidelines

**Large Numbers (KPI Cards):**
- Format: `$45,230` for currency, `12.4%` for percentages, `1,847` for counts
- Font: 32px, 700 weight, dark text
- Trend indicator: small colored arrow + percentage next to the number
- Period label: 12px, gray-500 below the number ("vs last month")

**Compact Metrics (Tables, Lists):**
- Format: same as above but 14px font
- Trend: inline arrow, no separate label
- Color: green for positive, red for negative, gray for neutral

**Metric Thresholds:**
- Display a small dot indicator next to metrics in tables:
 - Green dot: above target / positive trend
 - Amber dot: approaching threshold
 - Red dot: below target / negative trend
- Threshold lines on charts: dashed horizontal line at target value with label

### 10.4 Report-Specific Charts

**Cover Page:**
- No charts. Clean branding only.

**Executive Summary:**
- 3-5 KPI highlight cards (large numbers + trend)
- No detailed charts

**Channel Breakdown (per platform):**
- Primary: Area chart showing spend over time with conversion overlay
- Secondary: Horizontal bar chart showing top 5 campaigns by spend
- Tertiary: Small table with key metrics (impressions, clicks, CTR, cost, conversions, CPA, ROAS)

**Key Highlights:**
- Callout cards (2-3) with best-performing campaign/ad/page
- Mini sparkline chart (area, 30px height) next to each highlight

**Opportunities & Risks:**
- Table format with status indicators
- Red/green conditional formatting on change percentage

**Appendix:**
- Full data tables with all metrics
- Paginated if more than 50 rows

### 10.5 Responsive Chart Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1024px) | Full chart with all labels, legends on right |
| Tablet (768-1024px) | Chart full width, legends below, smaller font |
| Mobile (<768px) | Simplified chart, hide non-essential labels, horizontal scroll for tables |

### 10.6 Accessibility

- All charts must have `aria-label` descriptions
- Color is never the only indicator (use patterns, shapes, or labels)
- Minimum contrast ratio: 4.5:1 for text, 3:1 for chart elements
- Keyboard navigation: tab through data points, arrow keys to move between points
- Screen reader: provide data table alternative for complex charts
