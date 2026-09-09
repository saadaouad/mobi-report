import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReportListComponent } from '@reports/components';
import {
  ReportActions,
  selectReportStats,
  selectReports,
  selectReportsError,
  selectReportsLoading,
} from '@reports/store';
import {
  EmptyStateComponent,
  ErrorStateComponent,
  LoadingSpinnerComponent,
  PageHeaderComponent,
} from '@shared/components';

@Component({
  selector: 'app-report-list-page',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    PageHeaderComponent,
    ReportListComponent,
  ],
  templateUrl: './report-list-page.component.html',
})
export class ReportListPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly reports$ = this.store.select(selectReports);
  readonly loading$ = this.store.select(selectReportsLoading);
  readonly error$ = this.store.select(selectReportsError);
  readonly stats$ = this.store.select(selectReportStats);

  ngOnInit(): void {
    this.store.dispatch(ReportActions.loadReports());
    this.store.dispatch(ReportActions.loadObservations());
  }

  retry(): void {
    this.store.dispatch(ReportActions.loadReports());
  }
}
