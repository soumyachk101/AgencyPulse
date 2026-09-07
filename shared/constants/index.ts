export const COLORS = {
 primary: "#F43F5E",
 secondary: "#e11d48",
 rose: {
 50: "#fff1f2",
 100: "#ffe4e6",
 200: "#fecdd3",
 300: "#fda4af",
 400: "#fb7185",
 500: "#f43f5e",
 600: "#e11d48",
 700: "#be123c",
 800: "#9f1239",
 900: "#881337",
 },
};

export const SOCIAL_PLATFORMS = [
 "facebook",
 "instagram",
 "twitter",
 "linkedin",
] as const;

export const REPORT_STATUS = {
 DRAFT: "draft",
 PENDING_APPROVAL: "pending_approval",
 APPROVED: "approved",
 SENT: "sent",
} as const;

export const APPROVAL_STATUS = {
 PENDING: "pending",
 APPROVED: "approved",
 REJECTED: "rejected",
} as const;
