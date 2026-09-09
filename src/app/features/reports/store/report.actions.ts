import type { CreateReportPayload, FieldErrors, Observation, Report } from '@core/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ReportActions = createActionGroup({
  source: 'Reports',
  events: {
    'Load Reports': emptyProps(),
    'Load Reports Success': props<{ reports: Report[] }>(),
    'Load Reports Failure': props<{ error: string }>(),
    'Load Observations': emptyProps(),
    'Load Observations Success': props<{ observations: Observation[] }>(),
    'Load Observations Failure': props<{ error: string }>(),
    'Create Report': props<{ payload: CreateReportPayload }>(),
    'Create Report Success': emptyProps(),
    'Create Report Failure': props<{ error: string; fieldErrors: FieldErrors | null }>(),
    'Update Report': props<{ id: number; payload: CreateReportPayload }>(),
    'Update Report Success': emptyProps(),
    'Update Report Failure': props<{ error: string; fieldErrors: FieldErrors | null }>(),
    'Clear Save State': emptyProps(),
  },
});
