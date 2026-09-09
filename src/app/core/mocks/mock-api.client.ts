import { Injectable, inject } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiHttpError } from '../errors/api-error';
import { Observation } from '../models/observation.model';
import { CreateReportPayload, Report } from '../models/report.model';
import { OBSERVATIONS_MOCK } from './observations.mock';
import { REPORTS_MOCK } from './reports.mock';
import { MOCK_API_DELAY } from './mock-api.token';

/**
 * In-memory HTTP layer that mirrors the annex contract:
 * GET /reporting, GET /observations, POST /reporting, PUT /reporting/:id
 *
 * Success writes return 204. Duplicate emails return 400 with the expected body.
 * Swap this class for an HttpClient implementation when a real backend exists.
 */
@Injectable({ providedIn: 'root' })
export class MockApiClient {
  private readonly delayMs = inject(MOCK_API_DELAY);
  private reports: Report[] = structuredClone(REPORTS_MOCK);
  private readonly observations: Observation[] = structuredClone(OBSERVATIONS_MOCK);
  private nextId = Math.max(...this.reports.map((report) => report.id)) + 1;

  get<T>(path: string): Observable<T> {
    if (path === '/reporting') {
      return this.ok(structuredClone(this.reports) as T);
    }

    if (path === '/observations') {
      return this.ok(structuredClone(this.observations) as T);
    }

    const reportMatch = /^\/reporting\/(\d+)$/.exec(path);
    if (reportMatch) {
      const id = Number(reportMatch[1]);
      const report = this.reports.find((item) => item.id === id);
      if (!report) {
        return this.fail(404, { message: 'Not found' });
      }
      return this.ok(structuredClone(report) as T);
    }

    return this.fail(404, { message: `Unknown path ${path}` });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    if (path !== '/reporting') {
      return this.fail(404, { message: `Unknown path ${path}` });
    }

    const payload = body as CreateReportPayload;
    if (this.emailTaken(payload.author.email)) {
      return this.fail(400, { author: { email: ['This value already exist'] } });
    }

    const report = this.toReport(this.nextId++, payload);
    this.reports = [...this.reports, report];
    return this.noContent();
  }

  put<T>(path: string, body: unknown): Observable<T> {
    const match = /^\/reporting\/(\d+)$/.exec(path);
    if (!match) {
      return this.fail(404, { message: `Unknown path ${path}` });
    }

    const id = Number(match[1]);
    const existing = this.reports.find((item) => item.id === id);
    if (!existing) {
      return this.fail(404, { message: 'Not found' });
    }

    const payload = body as CreateReportPayload;
    if (this.emailTaken(payload.author.email, id)) {
      return this.fail(400, { author: { email: ['This value already exist'] } });
    }

    this.reports = this.reports.map((item) => (item.id === id ? this.toReport(id, payload) : item));
    return this.noContent();
  }

  reset(): void {
    this.reports = structuredClone(REPORTS_MOCK);
    this.nextId = Math.max(...this.reports.map((report) => report.id)) + 1;
  }

  private emailTaken(email: string, excludeId?: number): boolean {
    const normalized = email.toLowerCase();
    return this.reports.some(
      (report) => report.author.email.toLowerCase() === normalized && report.id !== excludeId,
    );
  }

  private toReport(id: number, payload: CreateReportPayload): Report {
    return {
      id,
      author: {
        first_name: payload.author.first_name,
        last_name: payload.author.last_name,
        email: payload.author.email,
        birth_date: payload.author.birth_date,
        sex: payload.author.sexe,
      },
      description: payload.description,
      observations: payload.observations.map((observationId) => {
        const observation = this.observations.find((item) => item.id === observationId);
        return observation
          ? structuredClone(observation)
          : { id: observationId, name: `Observation ${observationId}` };
      }),
    };
  }

  private ok<T>(body: T): Observable<T> {
    return this.withLatency(body);
  }

  private noContent<T>(): Observable<T> {
    return this.withLatency(undefined as T);
  }

  private fail<T>(status: number, error: unknown): Observable<T> {
    const failure = throwError(() => new ApiHttpError(status, error));
    if (this.delayMs <= 0) {
      return failure;
    }

    return timer(this.delayMs).pipe(switchMap(() => failure));
  }

  private withLatency<T>(body: T): Observable<T> {
    if (this.delayMs <= 0) {
      return new Observable((subscriber) => {
        subscriber.next(body);
        subscriber.complete();
      });
    }

    return timer(this.delayMs).pipe(switchMap(() => new Observable<T>((subscriber) => {
      subscriber.next(body);
      subscriber.complete();
    })));
  }
}

