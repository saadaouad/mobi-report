import { REPORTS_MOCK } from '@core/mocks';
import { ReportActions } from './report.actions';
import { initialReportState, reportReducer } from './report.reducer';

describe('reportReducer', () => {
  it('sets loading when reports are requested', () => {
    const state = reportReducer(initialReportState, ReportActions.loadReports());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores reports on success', () => {
    const state = reportReducer(
      { ...initialReportState, loading: true },
      ReportActions.loadReportsSuccess({ reports: REPORTS_MOCK }),
    );
    expect(state.loading).toBe(false);
    expect(state.reports).toEqual(REPORTS_MOCK);
  });

  it('stores an error on failure', () => {
    const state = reportReducer(
      { ...initialReportState, loading: true },
      ReportActions.loadReportsFailure({ error: 'Impossible de charger les signalements.' }),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Impossible de charger les signalements.');
  });

  it('clears saving after a successful create', () => {
    const state = reportReducer(
      { ...initialReportState, saving: true },
      ReportActions.createReportSuccess(),
    );
    expect(state.saving).toBe(false);
  });
});
