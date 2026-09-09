import type { FieldErrors, Observation, Report } from '@core/models';
import { createReducer, on } from '@ngrx/store';
import { ReportActions } from './report.actions';

export interface ReportState {
  reports: Report[];
  observations: Observation[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveError: string | null;
  fieldErrors: FieldErrors | null;
}

export const initialReportState: ReportState = {
  reports: [],
  observations: [],
  loading: false,
  saving: false,
  error: null,
  saveError: null,
  fieldErrors: null,
};

export const reportReducer = createReducer(
  initialReportState,
  on(ReportActions.loadReports, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReportActions.loadReportsSuccess, (state, { reports }) => ({
    ...state,
    reports,
    loading: false,
    error: null,
  })),
  on(ReportActions.loadReportsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ReportActions.loadObservations, (state) => ({
    ...state,
    error: state.error,
  })),
  on(ReportActions.loadObservationsSuccess, (state, { observations }) => ({
    ...state,
    observations,
  })),
  on(ReportActions.loadObservationsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ReportActions.createReport, ReportActions.updateReport, (state) => ({
    ...state,
    saving: true,
    saveError: null,
    fieldErrors: null,
  })),
  on(ReportActions.createReportSuccess, ReportActions.updateReportSuccess, (state) => ({
    ...state,
    saving: false,
    saveError: null,
    fieldErrors: null,
  })),
  on(
    ReportActions.createReportFailure,
    ReportActions.updateReportFailure,
    (state, { error, fieldErrors }) => ({
      ...state,
      saving: false,
      saveError: error,
      fieldErrors,
    }),
  ),
  on(ReportActions.clearSaveState, (state) => ({
    ...state,
    saving: false,
    saveError: null,
    fieldErrors: null,
  })),
);
