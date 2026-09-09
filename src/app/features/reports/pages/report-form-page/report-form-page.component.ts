import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, of, switchMap } from 'rxjs';
import { CreateReportPayload } from '@core/models';
import { ReportFormComponent } from '@reports/components';
import {
  ReportActions,
  selectExistingEmails,
  selectFieldErrors,
  selectObservations,
  selectReportById,
  selectReportsLoading,
  selectReportsSaving,
  selectSaveError,
} from '@reports/store';
import {
  ErrorStateComponent,
  LoadingSpinnerComponent,
  PageHeaderComponent,
} from '@shared/components';

@Component({
  selector: 'app-report-form-page',
  imports: [
    AsyncPipe,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    PageHeaderComponent,
    ReportFormComponent,
  ],
  templateUrl: './report-form-page.component.html',
})
export class ReportFormPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input<string | undefined>();

  readonly observations$ = this.store.select(selectObservations);
  readonly existingEmails$ = this.store.select(selectExistingEmails);
  readonly saving$ = this.store.select(selectReportsSaving);
  readonly saveError$ = this.store.select(selectSaveError);
  readonly fieldErrors$ = this.store.select(selectFieldErrors);
  readonly loading$ = this.store.select(selectReportsLoading);

  readonly report$ = toObservable(this.id).pipe(
    switchMap((id) => (id ? this.store.select(selectReportById(Number(id))) : of(null))),
  );

  readonly currentEmail$ = this.report$.pipe(map((report) => report?.author.email ?? null));

  ngOnInit(): void {
    this.store.dispatch(ReportActions.clearSaveState());
    this.store.dispatch(ReportActions.loadReports());
    this.store.dispatch(ReportActions.loadObservations());

    this.actions$
      .pipe(
        ofType(ReportActions.createReportSuccess, ReportActions.updateReportSuccess),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((action) => {
        const created = action.type === ReportActions.createReportSuccess.type;
        this.snackBar.open(
          created ? 'Signalement créé avec succès.' : 'Signalement modifié avec succès.',
          'Fermer',
          { duration: 3500 },
        );
        void this.router.navigate(['/reports']);
      });
  }

  isEditMode(): boolean {
    return Boolean(this.id());
  }

  onSubmit(payload: CreateReportPayload): void {
    const id = this.id();
    if (id) {
      this.store.dispatch(ReportActions.updateReport({ id: Number(id), payload }));
      return;
    }

    this.store.dispatch(ReportActions.createReport({ payload }));
  }

  onCancel(): void {
    void this.router.navigate(['/reports']);
  }
}
