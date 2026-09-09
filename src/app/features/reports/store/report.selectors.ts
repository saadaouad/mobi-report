import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { ReportState } from './report.reducer';

export const REPORTS_FEATURE_KEY = 'reports';

export const selectReportState = createFeatureSelector<ReportState>(REPORTS_FEATURE_KEY);

export const selectReports = createSelector(selectReportState, (state) => state.reports);

export const selectObservations = createSelector(selectReportState, (state) => state.observations);

export const selectReportsLoading = createSelector(selectReportState, (state) => state.loading);

export const selectReportsError = createSelector(selectReportState, (state) => state.error);

export const selectReportsSaving = createSelector(selectReportState, (state) => state.saving);

export const selectSaveError = createSelector(selectReportState, (state) => state.saveError);

export const selectFieldErrors = createSelector(selectReportState, (state) => state.fieldErrors);

export const selectReportById = (id: number) =>
  createSelector(selectReports, (reports) => reports.find((report) => report.id === id) ?? null);

export const selectReportStats = createSelector(selectReports, (reports) => ({
  total: reports.length,
  men: reports.filter((report) => report.author.sex === 'Homme').length,
  women: reports.filter((report) => report.author.sex === 'Femme').length,
  nonBinary: reports.filter((report) => report.author.sex === 'Non-binaire').length,
}));

export const selectExistingEmails = createSelector(selectReports, (reports) =>
  reports.map((report) => report.author.email),
);
