import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report } from '@/lib/types/report';

interface ReportState {
 reports: Report[];
 selectedReportId: string | null;
 isLoading: boolean;
 error: string | null;
 setReports: (reports: Report[]) => void;
 addReport: (report: Report) => void;
 updateReport: (id: string, updates: Partial<Report>) => void;
 deleteReport: (id: string) => void;
 selectReport: (id: string | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 reset: () => void;
}

const initialState = {
 reports: [],
 selectedReportId: null,
 isLoading: false,
 error: null,
};

export const useReportStore = create<ReportState>()(
 persist(
 (set) => ({
 ...initialState,
 setReports: (reports) => set({ reports }),
 addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
 updateReport: (id, updates) =>
 set((state) => ({
 reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
 })),
 deleteReport: (id) =>
 set((state) => ({ reports: state.reports.filter((r) => r.id !== id) })),
 selectReport: (id) => set({ selectedReportId: id }),
 setLoading: (isLoading) => set({ isLoading }),
 setError: (error) => set({ error }),
 reset: () => set(initialState),
 }),
 { name: 'report-storage', partialize: (state) => ({ reports: state.reports }) }
 )
);
