import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { getApiErrorMessage, getFieldErrors } from '../../../core/errors/api-error';
import { ObservationService } from '../../../core/services/observation.service';
import { ReportService } from '../../../core/services/report.service';
import { ReportActions } from './report.actions';

@Injectable()
export class ReportEffects {
  private readonly actions$ = inject(Actions);
  private readonly reportService = inject(ReportService);
  private readonly observationService = inject(ObservationService);

  readonly loadReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.loadReports),
      switchMap(() =>
        this.reportService.getReports().pipe(
          map((reports) => ReportActions.loadReportsSuccess({ reports })),
          catchError((error: unknown) =>
            of(ReportActions.loadReportsFailure({ error: getApiErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  readonly loadObservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.loadObservations),
      switchMap(() =>
        this.observationService.getObservations().pipe(
          map((observations) => ReportActions.loadObservationsSuccess({ observations })),
          catchError((error: unknown) =>
            of(ReportActions.loadObservationsFailure({ error: getApiErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );

  readonly createReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.createReport),
      switchMap(({ payload }) =>
        this.reportService.createReport(payload).pipe(
          mergeMap(() => [ReportActions.createReportSuccess(), ReportActions.loadReports()]),
          catchError((error: unknown) =>
            of(
              ReportActions.createReportFailure({
                error: getApiErrorMessage(error),
                fieldErrors: getFieldErrors(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly updateReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.updateReport),
      switchMap(({ id, payload }) =>
        this.reportService.updateReport(id, payload).pipe(
          mergeMap(() => [ReportActions.updateReportSuccess(), ReportActions.loadReports()]),
          catchError((error: unknown) =>
            of(
              ReportActions.updateReportFailure({
                error: getApiErrorMessage(error),
                fieldErrors: getFieldErrors(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
