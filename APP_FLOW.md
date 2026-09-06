# AgencyPulse — App Flow Documentation

**Version:** 1.0
**Date:** 2026-09-06

This document describes all major user flows in AgencyPulse, represented as Mermaid flowcharts. Each flow covers a distinct user journey from entry point to completion.

---

## Table of Contents

1. [Agency Onboarding](#1-agency-onboarding)
2. [Client Setup Flow](#2-client-setup-flow)
3. [Integration Connection Flow](#3-integration-connection-flow)
4. [Dashboard Navigation](#4-dashboard-navigation)
5. [Report Generation Flow](#5-report-generation-flow)
6. [White-Label Configuration Flow](#6-white-label-configuration-flow)
7. [Scheduling Reports Flow](#7-scheduling-reports-flow)
8. [Billing Flow](#8-billing-flow)

---

## 1. Agency Onboarding

The onboarding flow guides a new agency from signup to their first connected integration.

```mermaid
flowchart TD
 Start([Landing Page]) --> SignUp[Sign Up with Email<br/>or Google OAuth]
 SignUp --> Verify{Email<br/>Verified?}
 Verify -->|No| Resend[Resend Verification Email]
 Resend --> Verify
 Verify -->|Yes| OrgSetup[Organization Setup<br/>Agency Name, Timezone, Industry]
 OrgSetup --> TeamInvite{Add Team<br/>Members Now?}
 TeamInvite -->|Yes| InviteTeam[Send Invite Links<br/>to Team Members]
 TeamInvite -->|No| BrandSetup[Brand Setup<br/>Upload Logo, Set Colors]
 InviteTeam --> BrandSetup
 BrandSetup --> PlanSelect{Select<br/>Pricing Plan}
 PlanSelect -->|Starter| StarterSetup[Configure Starter Limits]
 PlanSelect -->|Growth| GrowthSetup[Configure Growth Limits]
 PlanSelect -->|Agency| AgencySetup[Configure Agency Limits]
 StarterSetup --> FirstClient[Prompt: Add Your First Client]
 GrowthSetup --> FirstClient
 AgencySetup --> FirstClient
 FirstClient --> ClientWizard[Launch Client Setup Wizard]
 ClientWizard --> Done([Onboarding Complete<br/>Redirect to Dashboard])
```

**Key pages/screens:**
- Landing page with pricing preview
- Signup form (email/password or Google OAuth via Clerk)
- Email verification interstitial
- Organization setup form
- Team invitation modal
- Brand setup page (logo upload, color picker)
- Plan selection with feature comparison
- First-client prompt / empty state

**Exit conditions:** Agency reaches the dashboard with at least one client configured and at least one data integration connected.

---

## 2. Client Setup Flow

The client setup wizard is a multi-step form that collects everything needed to generate the first report for a new client.

```mermaid
flowchart TD
 Start([Dashboard: Add Client Button]) --> Step1[Step 1: Client Info<br/>Name, Industry, Contact Email,<br/>Timezone, Notes]
 Step1 --> Validate1{Fields<br/>Valid?}
 Validate1 -->|No| ShowError1[Show Validation Errors]
 ShowError1 --> Step1
 Validate1 -->|Yes| Step2[Step 2: Data Sources<br/>Select which platforms to connect<br/>Google Ads, Meta Ads, GA4]
 Step2 --> HasSources{Any Sources<br/>Selected?}
 HasSources -->|No| Step2
 HasSources -->|Yes| Step3[Step 3: Connect Integrations<br/>OAuth flow for each selected platform]
 Step3 --> ConnectFlow{All Selected<br/>Connected?}
 ConnectFlow -->|No| RetryConnect[Retry / Skip Connection]
 RetryConnect --> Step3
 ConnectFlow -->|Yes| Step4[Step 4: Branding<br/>Use agency brand or<br/>create client-specific brand]
 Step4 --> BrandChoice{Custom Brand<br/>for Client?}
 BrandChoice -->|Yes| CustomBrand[Upload Client Logo,<br/>Set Custom Colors, Fonts]
 BrandChoice -->|No| UseAgencyBrand[Use Agency Default Branding]
 CustomBrand --> Step5
 UseAgencyBrand --> Step5[Step 5: Report Settings<br/>Template selection, KPIs,<br/>Schedule frequency]
 Step5 --> Step6[Step 6: Recipients<br/>Add email recipients,<br/>set delivery preferences]
 Step6 --> Review[Review & Confirm<br/>Summary of all settings]
 Review --> Confirm{Confirm<br/>Setup?}
 Confirm -->|No| EditStep[Go Back to Edit]
 EditStep --> Step3
 Confirm -->|Yes| SaveClient[Save Client Record]
 SaveClient --> TriggerSync[Trigger Initial Data Sync]
 TriggerSync --> Done([Client Created<br/>Redirect to Client Detail])
```

**Key pages/screens:**
- Client info form (step 1 of wizard)
- Data source selection (step 2)
- OAuth connection modal per platform (step 3)
- Brand configuration (step 4)
- Report settings form (step 5)
- Recipients form (step 6)
- Review & confirm screen
- Success confirmation with "Generate First Report" CTA

---

## 3. Integration Connection Flow

Each third-party integration follows an OAuth 2.0 flow. This diagram covers the generic pattern, with notes for Google Ads, Meta Ads, and GA4 specifics.

```mermaid
flowchart TD
 Start([Client Detail: Integrations Tab]) --> SelectPlatform{Select Platform}
 SelectPlatform -->|Google Ads| GAds[Google Ads OAuth Flow]
 SelectPlatform -->|Meta Ads| Meta[Meta Ads OAuth Flow]
 SelectPlatform -->|GA4| GA4[GA4 OAuth Flow]

 subgraph GAdsFlow [Google Ads OAuth]
 GAds --> GConsent[Google Consent Screen<br/>Request Ads & Analytics Scopes]
 GConsent --> GCallback[OAuth Callback<br/>Exchange Code for Tokens]
 GCallback --> GMCC{MCC / Manager<br/>Account?}
 GMCC -->|Yes| GSelectSub[Select Sub-Accounts<br/>from MCC Hierarchy]
 GMCC -->|No| GSelectSingle[Select Single Account]
 GSelectSub --> GTest[Test Connection<br/>Fetch Account Name & ID]
 GSelectSingle --> GTest
 GTest --> GSuccess{Connection<br/>Successful?}
 GSuccess -->|No| GRetry[Show Error<br/>Retry or Skip]
 GRetry --> GAds
 GSuccess -->|Yes| GSave[Save Refresh Token<br/>Store Account Mapping]
 end

 subgraph MetaFlow [Meta Ads OAuth]
 Meta --> MConsent[Meta Consent Screen<br/>Request Ads Management Scope]
 MConsent --> MCallback[OAuth Callback]
 MCallback --> MBM{Multiple Business<br/>Managers?}
 MBM -->|Yes| MSelectBM[Select Business Manager]
 MBM -->|No| MSelectAd[Select Ad Account]
 MSelectBM --> MSelectAd
 MSelectAd --> MTest[Test Connection<br/>Fetch Account Name & ID]
 MTest --> MSuccess{Connection<br/>Successful?}
 MSuccess -->|No| MRetry[Show Error<br/>Retry or Skip]
 MRetry --> Meta
 MSuccess -->|Yes| MSave[Save Refresh Token<br/>Store Account Mapping]
 end

 subgraph GA4Flow [GA4 OAuth]
 GA4 --> G4Consent[Google Consent Screen<br/>Request Analytics Read Scope]
 G4Consent --> G4Callback[OAuth Callback]
 G4Callback --> G4Select[Select GA4 Property]
 G4Select --> G4Test[Test Connection<br/>Fetch Property Name & ID]
 G4Test --> G4Success{Connection<br/>Successful?}
 G4Success -->|No| G4Retry[Show Error<br/>Retry or Skip]
 G4Retry --> GA4
 G4Success -->|Yes| G4Save[Save Refresh Token<br/>Store Property Mapping]
 end

 GSave --> SyncStatus[Show Integration Status<br/>Connected / Syncing / Error]
 MSave --> SyncStatus
 G4Save --> SyncStatus
 SyncStatus --> TriggerDataPull[Trigger Initial Data Pull<br/>Fetch last 25 months of data]
 TriggerDataPull --> Done([Integrations Ready<br/>Show Connected Badges])
```

**Key pages/screens:**
- Integrations tab on client detail page
- OAuth redirect to external provider
- Account/property selection dropdown
- Connection status indicator (connected, syncing, error, disconnected)
- Data freshness indicator ("Last synced 2 hours ago")

---

## 4. Dashboard Navigation

The main dashboard is the agency's command center. This flow covers the primary navigation paths.

```mermaid
flowchart TD
 Start([Agency Dashboard]) --> Sidebar[Navigation Sidebar]

 Sidebar --> DashboardHome[Dashboard Home<br/>Overview Stats & Recent Activity]
 Sidebar --> Clients[Client List<br/>All Clients with Status]
 Sidebar --> Reports[Reports<br/>Generated Reports History]
 Sidebar --> Templates[Templates<br/>Report Template Manager]
 Sidebar --> Integrations[Integrations<br/>All Connected Accounts]
 Sidebar --> Settings[Settings<br/>Agency & Account Settings]
 Sidebar --> Billing[Billing<br/>Subscription & Invoices]

 DashboardHome --> Stats[KPI Cards<br/>Total Clients, Reports This Month,<br/>Avg Open Rate, Sync Health]
 DashboardHome --> RecentReports[Recent Reports Table<br/>Client, Date, Status, Actions]
 DashboardHome --> QuickActions[Quick Actions<br/>+ New Client, Generate Report,<br/>Sync All Data]

 Clients --> ClientSearch[Search & Filter Clients<br/>by Name, Status, Industry]
 ClientSearch --> ClientList[Client List Cards<br/>Name, Integrations, Last Report, Status]
 ClientList --> ClickClient{Click Client}
 ClickClient --> ClientDetail[Client Detail Page]

 ClientDetail --> CDTabs{Tab Selection}
 CDTabs -->|Overview| CDOverview[Overview Tab<br/>KPIs, Charts, Quick Stats]
 CDTabs -->|Integrations| CDIntegrations[Integrations Tab<br/>Connected Platforms, Status]
 CDTabs -->|Reports| CDReports[Reports Tab<br/>Report History, Generate New]
 CDTabs -->|Settings| CDSettings[Settings Tab<br/>Branding, Schedule, Recipients]
 CDTabs -->|KPIs| CDKPIs[KPIs Tab<br/>Custom Metrics & Targets]

 CDReports --> GenerateReport[Generate New Report]
 GenerateReport --> ReportBuilder[Report Builder Flow]
 ReportBuilder --> ReportPreview[Report Preview]
 ReportPreview --> SendReport[Send / Schedule Report]

 Templates --> TemplateList[Template Gallery<br/>Pre-built + Custom]
 TemplateList --> EditTemplate[Template Editor]
 EditTemplate --> SaveTemplate[Save Template]
```

**Key pages/screens:**
- Dashboard home with stat cards and recent activity
- Client list with search/filter
- Client detail page with tabbed navigation
- Navigation sidebar with active state indicator
- Top bar with notification bell, user menu, org switcher

---

## 5. Report Generation Flow

From trigger to delivery — the complete report lifecycle.

```mermaid
flowchart TD
 Start([Trigger Report Generation]) --> TriggerSource{Trigger Source}
 TriggerSource -->|Manual| ManualTrigger[Account Manager clicks<br/>"Generate Report"]
 TriggerSource -->|Scheduled| ScheduledTrigger[Cron Job triggers<br/>auto-generation]
 TriggerSource -->|Bulk| BulkTrigger[Bulk Generate<br/>for multiple clients]

 ManualTrigger --> ConfigReport[Report Configuration<br/>Client, Date Range, Template]
 ScheduledTrigger --> ConfigReport
 BulkTrigger --> ConfigReport

 ConfigReport --> FetchData[Data Fetching Layer<br/>Pull from connected integrations<br/>Google Ads, Meta, GA4]
 FetchData --> Normalize[Normalize Data<br/>Unified metric schema,<br/>time-aligned periods]
 Normalize --> Compute[Compute Derived Metrics<br/>CTR, CPA, ROAS, Trends,<br/>MoM/YoY Comparisons]
 Compute --> GenerateNarrative[AI Narrative Generation<br/>GPT-4o: Executive Summary,<br/>Channel Narratives, Recommendations]
 GenerateNarrative --> RenderCharts[Render Charts<br/>Recharts: Line, Bar, Area, Pie]
 RenderCharts --> BuildPDF[PDF Generation<br/>Puppeteer: Render HTML template<br/>to 300 DPI PDF]
 BuildPDF --> UploadPDF[Upload PDF to Storage<br/>Supabase Storage]
 UploadPDF --> Preview{Preview<br/>Mode?}
 Preview -->|Yes| ShowPreview[Open Report Preview<br/>In-Browser PDF Viewer]
 ShowPreview --> EditNarrative{Edit<br/>Narrative?}
 EditNarrative -->|Yes| NarrativeEditor[Inline Narrative Editor<br/>Edit summary, recommendations]
 NarrativeEditor --> Regenerate[Regenerate PDF with Edits]
 Regenerate --> UploadPDF
 EditNarrative -->|No| DeliveryChoice{Delivery<br/>Action?}
 Preview -->|No| DeliveryChoice
 DeliveryChoice -->|Send Now| SendEmail[Send via SendGrid<br/>Attach PDF, Use Email Template]
 DeliveryChoice -->|Schedule| ScheduleEmail[Add to Schedule<br/>Set Date, Frequency, Recipients]
 DeliveryChoice -->|Download| DownloadPDF[Download PDF<br/>to Local Machine]
 SendEmail --> TrackDelivery[Track Delivery<br/>Opens, Bounces, Clicks]
 ScheduleEmail --> TrackDelivery
 DownloadPDF --> Done([Report Complete])
 TrackDelivery --> Done
```

**Key pages/screens:**
- Report generation trigger button (client detail, bulk actions)
- Report configuration modal (date range, template, sections)
- Report preview page with in-browser PDF viewer
- Inline narrative editor (contenteditable sections)
- Delivery confirmation with tracking stats

---

## 6. White-Label Configuration Flow

Configuring agency-level and client-level branding.

```mermaid
flowchart TD
 Start([Settings: Branding Tab]) --> Level{Configuration Level}
 Level -->|Agency-Wide| AgencyBrand[Agency Brand Settings<br/>Default for all clients]
 Level -->|Per-Client| ClientBrand[Client-Specific Brand Override]

 AgencyBrand --> LogoUpload[Logo Upload<br/>PNG/SVG, Transparent BG,<br/>Placement: Header, Cover, Footer]
 AgencyBrand --> ColorSetup[Brand Colors<br/>Primary, Secondary, Accent<br/>Color Picker + Hex Input]
 AgencyBrand --> FontSetup[Font Selection<br/>From curated list or upload]
 AgencyBrand --> FooterSetup[Custom Footer<br/>Agency contact, disclaimer text]

 ClientBrand --> OverrideCheck{Override<br/>Agency Defaults?}
 OverrideCheck -->|Yes| ClientLogo[Client-Specific Logo]
 OverrideCheck -->|No| InheritAgency[Inherit Agency Branding]
 ClientBrand --> ClientColor[Client-Specific Colors]
 ClientBrand --> ClientFont[Client-Specific Fonts]

 LogoUpload --> Preview[Live Brand Preview<br/>Sample report page with<br/>current brand applied]
 ColorSetup --> Preview
 FontSetup --> Preview
 FooterSetup --> Preview
 ClientLogo --> Preview
 ClientColor --> Preview
 ClientFont --> Preview

 Preview --> Save{Save Brand?}
 Save -->|Yes| Persist[Persist to Database<br/>Agency or Client record]
 Save -->|No| Adjust[Adjust Settings]
 Adjust --> LogoUpload
 Persist --> ApplyToReports[Apply Brand to All<br/>Existing & Future Reports]
 ApplyToReports --> Done([Branding Configured])
```

**Key pages/screens:**
- Agency branding settings page
- Brand kit manager (save multiple presets)
- Color picker with live preview
- Logo upload with drag-and-drop
- Font selector with preview
- Live report preview panel
- Per-client brand override toggle

---

## 7. Scheduling Reports Flow

Setting up automated, recurring report delivery.

```mermaid
flowchart TD
 Start([Client Detail: Settings Tab<br/>or Report Builder]) --> ScheduleToggle{Enable<br/>Scheduling?}
 ScheduleToggle -->|No| ManualOnly[Manual Delivery Only]
 ScheduleToggle -->|Yes| Frequency[Select Frequency<br/>Weekly / Bi-weekly / Monthly /<br/>Quarterly / Custom]

 Frequency --> DayConfig{Day / Date<br/>Configuration}
 DayConfig -->|Weekly| WeekDay[Select Day of Week<br/>Mon–Sun]
 DayConfig -->|Monthly| MonthDay[Select Date<br/>1st–28th or Last Day]
 DayConfig -->|Quarterly| QuarterConfig[Select Quarter Start<br/>Jan/Apr/Jul/Oct]
 DayConfig -->|Custom| CustomCron[Custom Cron Expression<br/>Advanced users]

 WeekDay --> TimeConfig[Select Send Time<br/>Timezone-aware time picker]
 MonthDay --> TimeConfig
 QuarterConfig --> TimeConfig
 CustomCron --> TimeConfig

 TimeConfig --> Recipients[Configure Recipients<br/>Add / Remove email addresses<br/>Set role per recipient]
 Recipients --> EmailCustom[Customize Email<br/>Subject line template,<br/>From name, Reply-to, Body]
 EmailCustom --> EmailPreview[Email Preview<br/>Rendered HTML preview]
 EmailPreview --> AttachOption{PDF Delivery<br/>Method}
 AttachOption -->|Attach| AttachPDF[Attach PDF to Email<br/>Max 25MB]
 AttachOption -->|Link| LinkPDF[Include Download Link<br/>Hosted PDF + Expiry]
 AttachOption -->|Embed| EmbedPDF[Embed Summary in Email<br/>+ Download Link]

 AttachPDF --> ConflictCheck{Conflicts with<br/>Existing Schedule?}
 LinkPDF --> ConflictCheck
 EmbedPDF --> ConflictCheck
 ConflictCheck -->|Yes| MergeOrReplace[Merge into existing<br/>or replace schedule]
 ConflictCheck -->|No| SaveSchedule[Save Schedule]
 MergeOrReplace --> SaveSchedule

 SaveSchedule --> TestSend[Send Test Email<br/>to agency admin]
 TestSend --> TestOK{Test Email<br/>Received OK?}
 TestOK -->|No| FixEmail[Fix Email Settings]
 FixEmail --> EmailCustom
 TestOK -->|Yes| ActivateSchedule[Activate Schedule<br/>Create Cron Job]
 ActivateSchedule --> Done([Schedule Active<br/>Next send shown on calendar])
```

**Key pages/screens:**
- Schedule configuration panel (client settings)
- Frequency selector (visual cards for each option)
- Day/date configuration
- Timezone-aware time picker
- Recipients list with add/remove
- Email customization form
- Live email preview
- Schedule calendar view (upcoming sends)
- Schedule list with enable/disable toggle

---

## 8. Billing Flow

Subscription management and billing lifecycle.

```mermaid
flowchart TD
 Start([Settings: Billing Tab]) --> CurrentPlan[Current Plan Display<br/>Starter / Growth / Agency,<br/>Price, Renewal Date, Usage]
 CurrentPlan --> Action{Billing Action}
 Action -->|Upgrade| UpgradeFlow[Upgrade Plan Flow]
 Action -->|Downgrade| DowngradeFlow[Downgrade Plan Flow]
 Action -->|Cancel| CancelFlow[Cancellation Flow]
 Action -->|View History| History[Invoice History<br/>Download PDFs, Payment Method]

 subgraph UpgradeFlow [Upgrade Flow]
 UpgradeFlow --> ShowPlans[Show Available Plans<br/>with Feature Comparison]
 ShowPlans --> SelectPlan[Select New Plan]
 SelectPlan --> Prorate{Current Period<br/>Proration?}
 Prorate -->|Yes| CalculateProrated[Calculate Prorated Amount<br/>Credit remaining + new charge]
 Prorate -->|No| FullCharge[Full New Plan Charge]
 CalculateProrated --> ConfirmUpgrade[Confirm Upgrade<br/>Show amount to be charged]
 FullCharge --> ConfirmUpgrade
 ConfirmUpgrade --> ProcessPayment[Process Payment<br/>via Stripe]
 ProcessPayment --> PaymentOK{Payment<br/>Successful?}
 PaymentOK -->|Yes| UpdatePlan[Update Plan in DB<br/>Provision new limits]
 PaymentOK -->|No| PaymentError[Show Error<br/>Update payment method]
 PaymentError --> UpdatePayment[Update Card Details]
 UpdatePayment --> ProcessPayment
 UpdatePlan --> Success[Show Success Message<br/>New limits active immediately]
 end

 subgraph DowngradeFlow [Downgrade Flow]
 DowngradeFlow --> DowngradeWarning[Show Downgrade Warning<br/>Features that will be lost,<br/>data limits that apply]
 DowngradeWarning --> SelectDowngradePlan[Select Lower Plan]
 SelectDowngradePlan --> DowngradeConfirm[Confirm Downgrade]
 DowngradeConfirm --> ScheduleDowngrade[Schedule for End<br/>of Current Period]
 ScheduleDowngrade --> DowngradeDone([Downgrade Scheduled<br/>Effective next billing cycle])
 end

 subgraph CancelFlow [Cancellation Flow]
 CancelFlow --> CancelSurvey[Exit Survey<br/>Reason for leaving]
 CancelSurvey --> CancelConfirm[Final Confirmation<br/>Data export option]
 CancelConfirm --> CancelData{Keep Data?}
 CancelData -->|Yes| ArchiveData[Archive Data<br/>Read-only access for 30 days]
 CancelData -->|No| DeleteData[Schedule Data Deletion<br/>after 30-day grace period]
 ArchiveData --> CancelDone([Cancellation Confirmed<br/>Access until period end])
 DeleteData --> CancelDone
 end

 History --> DownloadInvoice[Download Invoice PDF]
 History --> UpdatePaymentMethod[Update Payment Method]

 Success --> Done([Billing Updated])
 DowngradeDone --> Done
 CancelDone --> Done
```

**Key pages/screens:**
- Billing overview page (current plan, usage, next invoice)
- Plan comparison table
- Upgrade confirmation modal
- Downgrade warning modal
- Cancellation survey
- Invoice list with download
- Payment method management

---

## Appendix: State Diagram for Report Status

```mermaid
stateDiagram-v2
 [*] --> Draft: User starts report
 Draft --> Generating: User triggers generation
 Generating --> PreviewReady: PDF generated successfully
 Generating --> Failed: Error during generation
 Failed --> Generating: Retry
 PreviewReady --> Approved: User approves
 PreviewReady --> Editing: User edits narrative
 Editing --> Generating: User regenerates
 Editing --> Approved: User skips regeneration
 Approved --> Scheduled: User schedules delivery
 Approved --> Sent: User sends immediately
 Scheduled --> Sent: Cron triggers delivery
 Sent --> Delivered: Email delivered
 Delivered --> Opened: Client opens PDF
 Sent --> Bounced: Email bounces
 Bounced --> Sent: Retry send
```

## Appendix: Navigation Map

```
/ ──────────────────────────────────────────────
│ AgencyPulse │
├───────────────────────────────────────────────┤
│ 🏠 Dashboard 📋 Clients 📊 Reports │
│ 📑 Templates 🔌 Integrations ⚙️ Settings│
│ 💳 Billing 👤 [User Menu] │
└───────────────────────────────────────────────┘

Dashboard (/dashboard)
├── KPI Overview Cards
├── Recent Reports Table
└── Quick Actions

Clients (/clients)
├── Client List (/clients)
│ ├── Search / Filter
│ └── Client Card → Client Detail (/clients/:id)
│ ├── Overview (/clients/:id)
│ ├── Integrations (/clients/:id/integrations)
│ ├── Reports (/clients/:id/reports)
│ ├── KPIs (/clients/:id/kpis)
│ └── Settings (/clients/:id/settings)
└── Add Client Wizard (/clients/new)

Reports (/reports)
├── Report History
└── Generate Report (/reports/new)

Templates (/templates)
├── Template Gallery
└── Template Editor (/templates/:id)

Settings
├── Agency Settings (/settings/agency)
├── Branding (/settings/branding)
├── Team (/settings/team)
└── Integrations (/settings/integrations)

Billing (/billing)
├── Current Plan
├── Usage
├── Invoices
└── Payment Method
```
