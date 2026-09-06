# AgencyPulse — Component Structure Documentation

**Version:** 1.0
**Date:** 2026-09-06

This document describes the component hierarchy, state management architecture, and reusable component library for the AgencyPulse frontend.

---

## Table of Contents

1. [Component Tree](#1-component-tree)
2. [State Management](#2-state-management)
3. [Reusable Components](#3-reusable-components)

---

## 1. Component Tree

### 1.1 Top-Level App Structure

```
src/
├── app/
│ ├── (auth)/
│ │ ├── login/
│ │ │ └── page.tsx
│ │ ├── signup/
│ │ │ └── page.tsx
│ │ ├── verify/
│ │ │ └── page.tsx
│ │ └── layout.tsx
│ │
│ ├── (marketing)/
│ │ ├── landing/
│ │ │ └── page.tsx
│ │ ├── pricing/
│ │ │ └── page.tsx
│ │ ├── features/
│ │ │ └── page.tsx
│ │ └── layout.tsx
│ │
│ ├── (app)/
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ ├── clients/
│ │ │ ├── page.tsx
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── [id]/
│ │ │ ├── page.tsx
│ │ │ ├── integrations/
│ │ │ │ └── page.tsx
│ │ │ ├── reports/
│ │ │ │ ├── page.tsx
│ │ │ │ └── [reportId]/
│ │ │ │ └── page.tsx
│ │ │ ├── kpis/
│ │ │ │ └── page.tsx
│ │ │ └── settings/
│ │ │ └── page.tsx
│ │ ├── reports/
│ │ │ ├── page.tsx
│ │ │ └── new/
│ │ │ └── page.tsx
│ │ ├── templates/
│ │ │ ├── page.tsx
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ ├── settings/
│ │ │ ├── page.tsx
│ │ │ ├── agency/
│ │ │ │ └── page.tsx
│ │ │ ├── branding/
│ │ │ │ └── page.tsx
│ │ │ ├── team/
│ │ │ │ └── page.tsx
│ │ │ └── integrations/
│ │ │ └── page.tsx
│ │ ├── billing/
│ │ │ └── page.tsx
│ │ └── layout.tsx
│ │
│ ├── layout.tsx
│ ├── page.tsx
│ └── error.tsx
│
├── components/
│ ├── layout/
│ │ ├── AppSidebar.tsx
│ │ ├── TopBar.tsx
│ │ ├── MobileNav.tsx
│ │ ├── Breadcrumbs.tsx
│ │ └── PageTransition.tsx
│ │
│ ├── dashboard/
│ │ ├── KpiCard.tsx
│ │ ├── StatsGrid.tsx
│ │ ├── RecentReportsTable.tsx
│ │ ├── QuickActions.tsx
│ │ ├── SyncHealthWidget.tsx
│ │ └── ActivityFeed.tsx
│ │
│ ├── clients/
│ │ ├── ClientCard.tsx
│ │ ├── ClientList.tsx
│ │ ├── ClientSearchFilter.tsx
│ │ ├── ClientDetailHeader.tsx
│ │ ├── IntegrationCard.tsx
│ │ ├── IntegrationStatusBadge.tsx
│ │ ├── ReportCard.tsx
│ │ ├── KpiRow.tsx
│ │ └── ClientSettingsPanel.tsx
│ │
│ ├── reports/
│ │ ├── ReportBuilder.tsx
│ │ ├── SectionList.tsx
│ │ ├── SectionEditor.tsx
│ │ ├── NarrativeEditor.tsx
│ │ ├── ChartConfigPanel.tsx
│ │ ├── ReportPreview.tsx
│ │ ├── PdfViewer.tsx
│ │ ├── ReportCard.tsx
│ │ ├── DeliveryOptions.tsx
│ │ └── ScheduleConfig.tsx
│ │
│ ├── integrations/
│ │ ├── IntegrationConnector.tsx
│ │ ├── OAuthFlow.tsx
│ │ ├── AccountSelector.tsx
│ │ ├── SyncStatusIndicator.tsx
│ │ └── ConnectionCard.tsx
│ │
│ ├── templates/
│ │ ├── TemplateCard.tsx
│ │ ├── TemplateGallery.tsx
│ │ ├── TemplateEditor.tsx
│ │ ├── SectionOrderList.tsx
│ │ ├── SectionConfigPanel.tsx
│ │ └── TemplatePreview.tsx
│ │
│ ├── charts/
│ │ ├── AreaChart.tsx
│ │ ├── LineChart.tsx
│ │ ├── BarChart.tsx
│ │ ├── HorizontalBarChart.tsx
│ │ ├── PieChart.tsx
│ │ ├── FunnelChart.tsx
│ │ ├── Sparkline.tsx
│ │ ├── ChartTooltip.tsx
│ │ ├── ChartLegend.tsx
│ │ └── MetricSparkline.tsx
│ │
│ ├── forms/
│ │ ├── FormWrapper.tsx
│ │ ├── TextInput.tsx
│ │ ├── SelectInput.tsx
│ │ ├── DatePicker.tsx
│ │ ├── FileUpload.tsx
│ │ ├── ColorPicker.tsx
│ │ ├── ToggleSwitch.tsx
│ │ ├── CheckboxGroup.tsx
│ │ ├── MultiSelect.tsx
│ │ └── FormError.tsx
│ │
│ ├── ui/ (shadcn/ui primitives)
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── dialog.tsx
│ │ ├── dropdown-menu.tsx
│ │ ├── toast.tsx
│ │ ├── tooltip.tsx
│ │ ├── tabs.tsx
│ │ ├── accordion.tsx
│ │ ├── avatar.tsx
│ │ ├── badge.tsx
│ │ ├── progress.tsx
│ │ ├── skeleton.tsx
│ │ ├── separator.tsx
│ │ ├── popover.tsx
│ │ ├── table.tsx
│ │ ├── input.tsx
│ │ ├── label.tsx
│ │ ├── textarea.tsx
│ │ ├── scroll-area.tsx
│ │ ├── alert.tsx
│ │ ├── skeleton.tsx
│ │ └── ...
│ │
│ ├── settings/
│ │ ├── AgencySettingsForm.tsx
│ │ ├── BrandingForm.tsx
│ │ ├── TeamManagement.tsx
│ │ ├── TeamInviteModal.tsx
│ │ ├── RoleBadge.tsx
│ │ ├── BillingOverview.tsx
│ │ ├── UsageMeter.tsx
│ │ ├── PlanComparison.tsx
│ │ ├── InvoiceList.tsx
│ │ └── PaymentMethodForm.tsx
│ │
│ ├── onboarding/
│ │ ├── OnboardingWizard.tsx
│ │ ├── WizardStep.tsx
│ │ ├── OrgSetupStep.tsx
│ │ ├── BrandSetupStep.tsx
│ │ ├── TeamInviteStep.tsx
│ │ └── FirstClientStep.tsx
│ │
│ ├── auth/
│ │ ├── AuthGuard.tsx
│ │ ├── OrganizationGuard.tsx
│ │ ├── RoleGuard.tsx
│ │ ├── SignInForm.tsx
│ │ ├── SignUpForm.tsx
│ │ └── UserMenu.tsx
│ │
│ ├── shared/
│ │ ├── StatusBadge.tsx
│ │ ├── TrendIndicator.tsx
│ │ ├── LoadingSpinner.tsx
│ │ ├── EmptyState.tsx
│ │ ├── ErrorState.tsx
│ │ ├── ConfirmDialog.tsx
│ │ ├── DataTable.tsx
│ │ ├── SearchInput.tsx
│ │ ├── FilterDropdown.tsx
│ │ ├── Pagination.tsx
│ │ ├── DateRangePicker.tsx
│ │ ├── ExportButton.tsx
│ │ └── TooltipWrapper.tsx
│ │
│ └── providers/
│ ├── QueryProvider.tsx
│ ├── ThemeProvider.tsx
│ ├── ToastProvider.tsx
│ └── OrganizationProvider.tsx
│
├── lib/
│ ├── stores/
│ │ ├── useAppStore.ts
│ │ ├── useOrganizationStore.ts
│ │ ├── useClientStore.ts
│ │ ├── useReportStore.ts
│ │ ├── useThemeStore.ts
│ │ └── useUIStore.ts
│ │
│ ├── hooks/
│ │ ├── useClients.ts
│ │ ├── useReports.ts
│ │ ├── useIntegrations.ts
│ │ ├── useTemplates.ts
│ │ ├── useBilling.ts
│ │ ├── useDataSync.ts
│ │ ├── useAuth.ts
│ │ ├── useOrganization.ts
│ │ ├── useReportGeneration.ts
│ │ └── useTheme.ts
│ │
│ ├── services/
│ │ ├── api.ts
│ │ ├── clients.ts
│ │ ├── reports.ts
│ │ ├── integrations.ts
│ │ ├── templates.ts
│ │ ├── billing.ts
│ │ └── ai.ts
│ │
│ ├── utils/
│ │ ├── format.ts
│ │ ├── validation.ts
│ │ ├── dateUtils.ts
│ │ ├── chartConfig.ts
│ │ ├── exportPdf.ts
│ │ └── constants.ts
│ │
│ ├── types/
│ │ ├── client.ts
│ │ ├── report.ts
│ │ ├── integration.ts
│ │ ├── template.ts
│ │ ├── billing.ts
│ │ ├── organization.ts
│ │ └── user.ts
│ │
│ └── config/
│ ├── platforms.ts
│ ├── templates.ts
│ ├── email.ts
│ └── constants.ts
│
├── styles/
│ ├── globals.css
│ ├── tailwind.css
│ └── chart-themes.css
│
├── public/
│ ├── images/
│ ├── fonts/
│ └── templates/
│
└── tests/
 ├── components/
 ├── hooks/
 ├── pages/
 └── e2e/
```

### 1.2 Page-Level Component Trees

#### Dashboard Page

```
DashboardPage (server component)
├── KpiCards (fetches stats)
│ ├── KpiCard × 4
│ └── KpiCard.skeleton (loading)
├── RecentReportsTable
│ ├── DataTable (shadcn/ui)
│ ├── StatusBadge
│ └── ActionMenu
├── QuickActions
│ ├── Button (Add Client)
│ ├── Button (Generate Report)
│ └── Button (Sync All)
├── SyncHealthWidget
│ ├── SyncStatusIndicator
│ └── Progress bar
└── ActivityFeed
 └── ActivityItem × N
```

#### Client Detail Page

```
ClientDetailPage (server component)
├── ClientDetailHeader
│ ├── Breadcrumbs
│ ├── Button (Generate Report)
│ └── ActionMenu
├── TabNavigation (Tabs from shadcn/ui)
│ ├── OverviewTab
│ │ ├── StatsGrid
│ │ │ └── KpiCard × 4
│ │ ├── AreaChart (spend over time)
│ │ ├── PlatformBreakdown
│ │ │ └── IntegrationCard × N
│ │ └── RecentReportsStrip
│ │ └── ReportCard × N
│ ├── IntegrationsTab
│ │ ├── IntegrationCard × N
│ │ └── ConnectNewButton
│ ├── ReportsTab
│ │ ├── ReportGrid
│ │ │ └── ReportCard × N
│ │ └── GenerateReportCard
│ ├── KpisTab
│ │ ├── KpiList
│ │ │ └── KpiRow × N
│ │ └── AddKpiButton
│ └── SettingsTab
│ ├── BrandingPanel
│ └── SchedulePanel
```

#### Report Builder Page

```
ReportBuilderPage
├── ReportBuilderHeader
│ ├── Button (Back)
│ ├── Select (Client)
│ ├── DateRangePicker
│ └── ActionButtons (Preview, Save)
├── TwoColumnLayout
│ ├── SectionList (left, 320px)
│ │ ├── SectionItem × N
│ │ │ ├── DragHandle
│ │ │ ├── Checkbox
│ │ │ └── SectionTitle
│ │ └── AddSectionButton
│ └── SectionEditor (right, flex-1)
│ ├── NarrativeEditor
│ │ ├── EditableTextArea
│ │ ├── RegenerateButton
│ │ └── CharacterCount
│ ├── ChartConfigPanel
│ │ ├── ChartTypeSelector
│ │ ├── MetricSelector
│ │ └── DateRangePicker
│ └── RecommendationEditor
│ ├── RecommendationCard × N
│ └── AddRecommendationButton
```

#### Landing Page

```
LandingPage
├── Navbar
│ ├── Logo
│ ├── NavLinks (Features, Pricing)
│ ├── SignInLink
│ └── CTAButton (Get Started)
├── HeroSection
│ ├── Heading (h1)
│ ├── Subheading (p)
│ ├── EmailInput + CTAButton
│ └── SocialProofLogos
├── FeaturesSection
│ ├── SectionHeading
│ └── FeatureGrid (3 columns)
│ └── FeatureCard × 3
│ ├── Icon
│ ├── Title
│ └── Description
├── HowItWorksSection
│ ├── SectionHeading
│ └── StepList (3 steps)
│ └── StepItem × 3
├── PricingSection
│ ├── SectionHeading
│ ├── PricingToggle (Monthly/Annual)
│ └── PricingCards (3 columns)
│ └── PricingCard × 3
├── FinalCtaSection
│ ├── Heading
│ ├── Subheading
│ └── CTAButton
└── Footer
 ├── LogoColumn
 ├── LinkColumns (4)
 └── Copyright
```

---

## 2. State Management

### 2.1 State Architecture

AgencyPulse uses a hybrid state management approach:

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| Server State | TanStack Query (React Query) | API data fetching, caching, background refetch |
| Client State | Zustand | UI state, form state, client-side preferences |
| Form State | React Hook Form + Zod | Form validation, field-level state |
| URL State | Next.js Search Params | Filters, pagination, modals, active tabs |

### 2.2 TanStack Query (Server State)

Server state covers all data that comes from the backend API. TanStack Query manages caching, deduplication, background refetching, and loading/error states.

**Query Key Structure:**

```
['clients', { organizationId, search, status, page, limit }]
['client', { clientId }]
['reports', { clientId, dateFrom, dateTo, page, limit }]
['report', { reportId }]
['integrations', { clientId }]
['templates']
['template', { templateId }]
['kpis', { clientId }]
['billing', 'current-plan']
['billing', 'invoices']
['team-members']
['data-sync-status', { clientId, platform }]
```

**Query Configuration:**

```typescript
// Clients list - refetch on window focus, stale after 30s
useQuery({
 queryKey: ['clients', filters],
 queryFn: () => api.clients.list(filters),
 staleTime: 30_000,
 refetchOnWindowFocus: true,
})

// Client detail - stale after 1 minute
useQuery({
 queryKey: ['client', clientId],
 queryFn: () => api.clients.get(clientId),
 staleTime: 60_000,
 refetchOnWindowFocus: true,
})

// Report generation - no caching (always fresh)
useQuery({
 queryKey: ['report', reportId],
 queryFn: () => api.reports.get(reportId),
 staleTime: 0,
 gcTime: 0,
})
```

**Mutations with Optimistic Updates:**

```typescript
// Generate report - show toast on success, invalidate reports list
useMutation({
 mutationFn: (params) => api.reports.generate(params),
 onSuccess: () => {
 queryClient.invalidateQueries(['reports'])
 toast.success('Report generated successfully')
 },
})
```

### 2.3 Zustand Stores (Client State)

Zustand stores handle UI state that doesn't belong on the server or in URL params.

**App Store (`useAppStore`):**

```typescript
interface AppState {
 // UI state
 sidebarOpen: boolean
 sidebarCollapsed: boolean
 activeModal: string | null
 modalData: Record<string, unknown> | null

 // Actions
 toggleSidebar: () => void
 setActiveModal: (modal: string | null, data?: unknown) => void
 closeModal: () => void
}
```

**Organization Store (`useOrganizationStore`):**

```typescript
interface OrganizationState {
 currentOrganization: Organization | null
 organizations: Organization[]
 isLoading: boolean

 setCurrentOrganization: (org: Organization) => void
 fetchOrganizations: () => Promise<void>
}
```

**Client Store (`useClientStore`):**

```typescript
interface ClientState {
 selectedClientId: string | null
 clientSearchQuery: string
 clientFilters: ClientFilters
 bulkSelectedClientIds: string[]

 setSelectedClient: (id: string | null) => void
 setSearchQuery: (query: string) => void
 setFilters: (filters: Partial<ClientFilters>) => void
 toggleBulkSelect: (id: string) => void
 clearBulkSelection: () => void
}
```

**Report Store (`useReportStore`):**

```typescript
interface ReportState {
 reportBuilderState: {
 selectedClientId: string | null
 dateRange: { from: Date; to: Date }
 selectedTemplateId: string | null
 sections: SectionConfig[]
 isDirty: boolean
 }

 // Draft auto-save
 draftReport: ReportDraft | null

 setBuilderState: (state: Partial<BuilderState>) => void
 saveDraft: () => Promise<void>
 loadDraft: () => Promise<void>
 clearDraft: () => void
}
```

**Theme Store (`useThemeStore`):**

```typescript
interface ThemeState {
 theme: 'light' | 'dark' | 'system'
 resolvedTheme: 'light' | 'dark'

 setTheme: (theme: 'light' | 'dark' | 'system') => void
}
```

**UI Store (`useUIStore`):**

```typescript
interface UIState {
 // Toast notifications
 toasts: Toast[]
 addToast: (toast: Omit<Toast, 'id'>) => void
 removeToast: (id: string) => void

 // Confirmation dialogs
 confirmDialog: { open: boolean; message: string; onConfirm: () => void } | null
 openConfirmDialog: (message: string, onConfirm: () => void) => void
 closeConfirmDialog: () => void

 // Loading overlays
 globalLoading: boolean
 setGlobalLoading: (loading: boolean) => void
}
```

### 2.4 React Hook Form (Form State)

Used for all multi-field forms (client setup, integration config, billing, settings).

```typescript
// Example: Client creation form
const clientSchema = z.object({
 name: z.string().min(1, 'Name is required'),
 industry: z.string().optional(),
 contactEmail: z.string().email('Invalid email'),
 timezone: z.string().min(1, 'Timezone is required'),
 notes: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

function ClientForm({ onSubmit }: { onSubmit: (data: ClientFormData) => void }) {
 const form = useForm<ClientFormData>({
 resolver: zodResolver(clientSchema),
 defaultValues: {
 name: '',
 industry: '',
 contactEmail: '',
 timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
 notes: '',
 },
 })

 return (
 <FormWrapper form={form} onSubmit={onSubmit}>
 <TextInput name="name" label="Client Name" />
 <TextInput name="contactEmail" label="Contact Email" type="email" />
 <SelectInput name="industry" label="Industry" options={INDUSTRIES} />
 <SelectInput name="timezone" label="Timezone" options={TIMEZONES} />
 <TextInput name="notes" label="Notes" />
 <Button type="submit">Create Client</Button>
 </FormWrapper>
 )
}
```

### 2.5 URL State (Search Params)

Filters, pagination, and view modes are managed via URL search params for shareability and browser history support.

```typescript
// Client list filters from URL
const [searchParams, setSearchParams] = useSearchParams()

const filters = {
 search: searchParams.get('search') || '',
 status: searchParams.get('status') || 'all',
 industry: searchParams.get('industry') || 'all',
 page: parseInt(searchParams.get('page') || '1'),
 sort: searchParams.get('sort') || 'name',
}
```

### 2.6 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User Interaction │
└─────────────────────────────────────────────────────────────┘
 │
 ▼
┌─────────────────────────────────────────────────────────────┐
│ Component Event Handler │
│ (onClick, onChange, onSubmit) │
└─────────────────────────────────────────────────────────────┘
 │
 ├─── Server State ────▶ TanStack Query
 │ ├── useQuery (fetch data)
 │ ├── useMutation (send changes)
 │ └── Cache invalidation
 │
 ├─── Client State ────▶ Zustand Store
 │ ├── UI preferences
 │ ├── Form drafts
 │ └── Navigation state
 │
 ├─── Form State ────▶ React Hook Form
 │ ├── Field validation
 │ ├── Error messages
 │ └── Form submission
 │
 └─── URL State ────▶ Next.js Search Params
 ├── Filters
 ├── Pagination
 └── Active tabs / modals
```

---

## 3. Reusable Components

### 3.1 Layout Components

#### `AppSidebar`

**Purpose:** Primary navigation sidebar for the authenticated app.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `collapsed` | `boolean` | `false` | Whether sidebar is collapsed to icon-only |
| `activePath` | `string` | `'/'` | Current route for active state highlighting |

**Features:**
- Collapsible (icon-only mode at 64px width)
- Active route highlighting with purple left border
- Organization name at top
- User section at bottom
- Mobile: hidden by default, slide-in drawer

#### `TopBar`

**Purpose:** Top navigation bar with search, notifications, and user menu.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title shown in center |
| `breadcrumbs` | `BreadcrumbItem[]` | Breadcrumb trail |
| `actions` | `ReactNode[]` | Action buttons on the right |

**Features:**
- Search input with keyboard shortcut hint (Cmd+K)
- Notification bell with unread badge
- User dropdown (profile, settings, sign out)
- Contextual actions slot

#### `PageTransition`

**Purpose:** Animated wrapper for page content transitions.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Page content |
| `transition` | `'fade' \| 'slide' \| 'none'` | Animation type |

### 3.2 Dashboard Components

#### `KpiCard`

**Purpose:** Display a single key performance indicator with trend.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Metric name (e.g., "Total Spend") |
| `value` | `string \| number` | Current value |
| `trend` | `{ value: number; direction: 'up' \| 'down' \| 'flat' }` | Period-over-period trend |
| `format` | `'currency' \| 'percentage' \| 'number'` | Value formatting |
| `icon` | `LucideIcon` | Optional icon |
| `loading` | `boolean` | Show skeleton |
| `href` | `string` | Optional link |

**Variants:**
- Default: white background, border
- Elevated: shadow-md, slightly raised
- Gradient: purple gradient background (for hero KPI section)

#### `StatsGrid`

**Purpose:** Responsive grid of KpiCards.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | KpiCard components |
| `columns` | `2 \| 3 \| 4 \| 5` | `4` | Number of columns |
| `loading` | `boolean` | `false` | Show skeleton cards |

#### `RecentReportsTable`

**Purpose:** Table showing recent report activity for a client or agency.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `reports` | `Report[]` | Report data |
| `clientId` | `string \| null` | Optional client filter |
| `onRowClick` | `(report: Report) => void` | Row click handler |
| `loading` | `boolean` | Loading state |

**Columns (default):**
- Client name
- Report period
- Status (Sent / Draft / Scheduled / Failed)
- Generated date
- Actions (View, Download, Resend)

#### `SyncHealthWidget`

**Purpose:** Shows data sync status for all integrations.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `integrations` | `Integration[]` | Connected integrations |
| `onRetry` | `(platform: string) => void` | Retry sync handler |

**States:**
- Connected: green dot + "Synced X hours ago"
- Syncing: spinning indicator + "Syncing..."
- Error: red dot + "Sync failed" + Retry button
- Disconnected: gray dot + "Not connected" + Connect button

#### `QuickActions`

**Purpose:** Row of common action buttons.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `actions` | `ActionItem[]` | Action configuration |

```typescript
type ActionItem = {
 label: string
 icon: LucideIcon
 onClick: () => void
 variant?: 'primary' | 'secondary' | 'ghost'
 disabled?: boolean
 loading?: boolean
}
```

### 3.3 Client Components

#### `ClientCard`

**Purpose:** Card representation of a client in list/grid views.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `client` | `ClientSummary` | Client data |
| `onClick` | `() => void` | Navigate to client detail |
| `selected` | `boolean` | Bulk selection state |
| `onToggleSelect` | `() => void` | Toggle selection |

**Content:**
- Client name + industry badge
- Integration count + status dots
- Last report date + status
- KPI summary (spend, ROAS)

#### `ClientList`

**Purpose:** Searchable, filterable list of clients.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `clients` | `ClientSummary[]` | Client data |
| `loading` | `boolean` | Loading state |
| `selectedIds` | `string[]` | Bulk selection |
| `onSelect` | `(id: string) => void` | Toggle selection |
| `onBulkAction` | `(action: string, ids: string[]) => void` | Bulk action handler |

**Features:**
- Search by name/industry
- Filter by status (Active, Inactive, Syncing, Error)
- Sort by name, last report date, spend
- Grid (cards) / List (rows) view toggle
- Bulk select with checkboxes
- Bulk actions: Generate Reports, Apply Template, Delete

#### `ClientSearchFilter`

**Purpose:** Search input and filter controls for client list.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `search` | `string` | Current search query |
| `onSearchChange` | `(query: string) => void` | Search handler |
| `filters` | `ClientFilters` | Current filters |
| `onFilterChange` | `(filters: Partial<ClientFilters>) => void` | Filter handler |
| `industries` | `string[]` | Available industry options |
| `statuses` | `string[]` | Available status options |

#### `IntegrationCard`

**Purpose:** Card showing a connected data integration with status and actions.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `integration` | `Integration` | Integration data |
| `onConnect` | `() => void` | Connect/reconnect handler |
| `onDisconnect` | `() => void` | Disconnect handler |
| `onSettings` | `() => void` | Settings handler |

**Content:**
- Platform icon + name
- Account name + ID
- Sync status badge
- Last synced timestamp
- Action buttons (Settings, Disconnect, Reconnect)

#### `IntegrationStatusBadge`

**Purpose:** Small status indicator for integration health.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `status` | `'connected' \| 'syncing' \| 'error' \| 'disconnected'` | Connection status |
| `lastSynced` | `string \| null` | ISO timestamp |

**Variants:**
- Connected: green dot + "Connected"
- Syncing: amber spinner + "Syncing..."
- Error: red dot + "Error" + error tooltip
- Disconnected: gray dot + "Not connected"

### 3.4 Report Components

#### `ReportBuilder`

**Purpose:** Main report configuration and editing interface.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `clientId` | `string` | Target client |
| `initialTemplateId` | `string \| null` | Starting template |
| `onSave` | `(report: ReportConfig) => void` | Save handler |
| `onPreview` | `(report: ReportConfig) => void` | Preview handler |

**State:**
- Selected sections (ordered list with drag-drop)
- Per-section configuration (title, AI enabled, tone, charts)
- Narrative text (editable)
- Recommendations list

#### `SectionList`

**Purpose:** Ordered list of report sections with drag-drop reordering.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `sections` | `SectionConfig[]` | Section definitions |
| `selectedId` | `string \| null` | Currently selected section |
| `onSelect` | `(id: string) => void` | Selection handler |
| `onReorder` | `(sections: SectionConfig[]) => void` | Reorder handler |
| `onToggle` | `(id: string, enabled: boolean) => void` | Toggle visibility |

**Features:**
- Drag handle (6-dot grid icon)
- Checkbox for enable/disable
- Visual reorder placeholder
- Hover actions (edit, duplicate, delete)

#### `NarrativeEditor`

**Purpose:** Inline editor for AI-generated narrative text.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `content` | `string` | Current narrative text |
| `onChange` | `(text: string) => void` | Text change handler |
| `onRegenerate` | `() => void` | AI regeneration handler |
| `loading` | `boolean` | AI generation in progress |
| `tone` | `NarrativeTone` | Narrative tone setting |

**Features:**
- ContentEditable div (or textarea for simplicity)
- "Regenerate with AI" button with loading state
- Word/character count
- Tone selector (Professional, Casual, Technical, Executive)

#### `PdfViewer`

**Purpose:** In-browser PDF viewer for report preview.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | PDF URL (Supabase Storage signed URL) |
| `loading` | `boolean` | Loading state |

**Features:**
- iframe-based PDF rendering
- Page navigation (prev/next, page input)
- Zoom controls (fit-width, fit-page, zoom in/out)
- Download button
- Print button

#### `ScheduleConfig`

**Purpose:** Configuration panel for report scheduling.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `schedule` | `ScheduleConfig \| null` | Current schedule |
| `onSave` | `(config: ScheduleConfig) => void` | Save handler |
| `recipients` | `Recipient[]` | Email recipients |
| `onRecipientsChange` | `(recipients: Recipient[]) => void` | Recipients handler |

**Fields:**
- Frequency: Weekly / Bi-weekly / Monthly / Quarterly / Custom
- Day/date configuration (contextual)
- Time picker (timezone-aware)
- Recipients list (add/remove)
- Email customization (subject, from name, reply-to)
- Delivery method: Attach PDF / Include Link / Embed Summary

### 3.5 Chart Components

All chart components wrap Recharts with AgencyPulse-specific styling, tooltips, and legends.

#### `AreaChart`

```typescript
interface AreaChartProps {
 data: TimeSeriesData[]
 series: ChartSeries[]
 dateRange: { from: Date; to: Date }
 showLegend?: boolean
 height?: number
 format?: 'currency' | 'percentage' | 'number'
}
```

#### `LineChart`

```typescript
interface LineChartProps {
 data: TimeSeriesData[]
 series: ChartSeries[]
 showLegend?: boolean
 showDots?: boolean
 height?: number
}
```

#### `BarChart`

```typescript
interface BarChartProps {
 data: CategoryData[]
 series: ChartSeries[]
 orientation?: 'vertical' | 'horizontal'
 showLegend?: boolean
 height?: number
}
```

#### `PieChart`

```typescript
interface PieChartProps {
 data: PieData[]
 showLegend?: boolean
 showLabels?: boolean
 innerRadius?: number // For donut charts
 height?: number
}
```

#### `Sparkline`

```typescript
interface SparklineProps {
 data: number[]
 trend: 'up' | 'down' | 'flat'
 color?: string
 width?: number
 height?: number
}
```

### 3.6 Form Components

Built on top of shadcn/ui primitives with AgencyPulse-specific styling.

#### `TextInput`

```typescript
interface TextInputProps {
 name: string
 label: string
 type?: 'text' | 'email' | 'password' | 'url' | 'tel'
 placeholder?: string
 hint?: string
 error?: string
 disabled?: boolean
 required?: boolean
}
```

#### `SelectInput`

```typescript
interface SelectInputProps {
 name: string
 label: string
 options: { value: string; label: string }[]
 placeholder?: string
 error?: string
 disabled?: boolean
 required?: boolean
}
```

#### `DatePicker`

```typescript
interface DatePickerProps {
 name: string
 label: string
 fromDate?: Date
 toDate?: Date
 format?: string
 error?: string
}
```

#### `FileUpload`

```typescript
interface FileUploadProps {
 name: string
 label: string
 accept?: string[]
 maxSize?: number // MB
 onUpload: (file: File) => Promise<string>
 preview?: string
 error?: string
}
```

#### `ColorPicker`

```typescript
interface ColorPickerProps {
 name: string
 label: string
 value: string
 onChange: (color: string) => void
 presets?: string[]
}
```

#### `ToggleSwitch`

```typescript
interface ToggleSwitchProps {
 name: string
 label: string
 description?: string
 checked: boolean
 onChange: (checked: boolean) => void
 disabled?: boolean
}
```

### 3.7 Shared Components

#### `StatusBadge`

```typescript
interface StatusBadgeProps {
 status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
 label?: string
 dot?: boolean
 size?: 'sm' | 'md'
}
```

**Usage:**
```tsx
<StatusBadge status="success" label="Sent" />
<StatusBadge status="error" dot />
<StatusBadge status="syncing" label="Syncing..." />
```

#### `TrendIndicator`

```typescript
interface TrendIndicatorProps {
 value: number // Percentage change
 direction?: 'up' | 'down' | 'flat' // Auto-detected if not provided
 prefix?: string // e.g., '$'
 suffix?: string // e.g., '%'
 showValue?: boolean
 size?: 'sm' | 'md' | 'lg'
}
```

**Usage:**
```tsx
<TrendIndicator value={12.4} suffix="%" /> {/* +12.4% green */}
<TrendIndicator value={-3.2} prefix="$" /> {/* -$3.20 red */}
<TrendIndicator value={0} /> {/* No change gray */}
```

#### `EmptyState`

```typescript
interface EmptyStateProps {
 icon?: LucideIcon
 title: string
 description?: string
 action?: {
 label: string
 onClick: () => void
 }
 secondaryAction?: {
 label: string
 onClick: () => void
 }
}
```

**Usage:**
```tsx
<EmptyState
 icon={PlusCircle}
 title="No clients yet"
 description="Add your first client to start generating reports."
 action={{ label: 'Add Client', onClick: () => navigate('/clients/new') }}
/>
```

#### `ErrorState`

```typescript
interface ErrorStateProps {
 title?: string
 description?: string
 onRetry?: () => void
 retryLabel?: string
}
```

#### `ConfirmDialog`

```typescript
interface ConfirmDialogProps {
 open: boolean
 title: string
 description?: string
 confirmLabel?: string
 cancelLabel?: string
 variant?: 'default' | 'destructive'
 onConfirm: () => void | Promise<void>
 onCancel: () => void
}
```

#### `DataTable`

```typescript
interface DataTableProps<T> {
 data: T[]
 columns: ColumnDef<T>[]
 loading?: boolean
 searchable?: boolean
 searchPlaceholder?: string
 pagination?: {
 page: number
 pageSize: number
 total: number
 onPageChange: (page: number) => void
 }
 onRowClick?: (row: T) => void
 selection?: {
 selectedIds: string[]
 onToggle: (id: string) => void
 }
 emptyState?: ReactNode
}
```

### 3.8 Auth Components

#### `AuthGuard`

```typescript
interface AuthGuardProps {
 children: ReactNode
 redirectTo?: string
 requireOrganization?: boolean
 requiredRole?: Role[]
}
```

**Behavior:**
- Redirects to `/login` if not authenticated
- Redirects to onboarding if no organization
- Shows 403 if role requirement not met
- Renders loading skeleton during auth check

#### `RoleGuard`

```typescript
interface RoleGuardProps {
 children: ReactNode
 allowedRoles: Role[]
 fallback?: ReactNode
}
```

**Usage:**
```tsx
<RoleGuard allowedRoles={['admin', 'manager']}>
 <TeamManagement />
</RoleGuard>
```

---

## Appendix: Component Naming Conventions

| Pattern | Example | Description |
|---------|---------|-------------|
| Page components | `DashboardPage`, `ClientDetailPage` | Next.js page files |
| Layout components | `AppSidebar`, `TopBar` | Structural wrappers |
| Feature components | `ReportBuilder`, `ClientList` | Feature-specific composites |
| Presentational | `KpiCard`, `StatusBadge` | Pure display, minimal logic |
| Container | `DashboardStatsSection` | Manages data fetching + children |
| Form components | `TextInput`, `SelectInput` | Reusable form primitives |
| Hook components | `useClients`, `useReports` | Custom data hooks |
| Store hooks | `useAppStore`, `useClientStore` | Zustand store hooks |

## Appendix: File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase + `.tsx` | `KpiCard.tsx` |
| Hooks | camelCase + `use` prefix + `.ts` | `useClients.ts` |
| Stores | camelCase + `use` prefix + `.ts` | `useAppStore.ts` |
| Utilities | camelCase + `.ts` | `format.ts` |
| Types | PascalCase + `.ts` | `client.ts` |
| Constants | UPPER_SNAKE_CASE + `.ts` | `PLATFORMS.ts` |
| Services | camelCase + `.ts` | `reports.ts` |
