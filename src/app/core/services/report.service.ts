import { Injectable, inject } from '@angular/core';
import { MockApiClient } from '@core/mocks';
import type { CreateReportPayload, Report } from '@core/models';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly api = inject(MockApiClient);

  getReports(): Observable<Report[]> {
    return this.api.get<Report[]>('/reporting');
  }

  getReport(id: number): Observable<Report> {
    return this.api.get<Report>(`/reporting/${id}`);
  }

  createReport(payload: CreateReportPayload): Observable<void> {
    return this.api.post<void>('/reporting', payload);
  }

  updateReport(id: number, payload: CreateReportPayload): Observable<void> {
    return this.api.put<void>(`/reporting/${id}`, payload);
  }
}
