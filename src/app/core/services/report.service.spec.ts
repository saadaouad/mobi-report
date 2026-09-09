import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ApiHttpError } from '@core/errors';
import { MOCK_API_DELAY, MockApiClient } from '@core/mocks';
import { CreateReportPayload } from '@core/models';
import { ReportService } from './report.service';

function payload(email: string): CreateReportPayload {
  return {
    author: {
      first_name: 'Saad',
      last_name: 'Test',
      birth_date: '1994-05-12',
      sexe: 'Homme',
      email,
    },
    description: 'Un incident réseau',
    observations: [1, 2],
  };
}

describe('ReportService', () => {
  let service: ReportService;
  let api: MockApiClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MOCK_API_DELAY, useValue: 0 }],
    });
    service = TestBed.inject(ReportService);
    api = TestBed.inject(MockApiClient);
    api.reset();
  });

  it('returns the static reports list', async () => {
    const reports = await firstValueFrom(service.getReports());
    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0]?.author.email).toBe('j.doe@mobireport.com');
  });

  it('creates a report and returns 204 (undefined body)', async () => {
    await expect(firstValueFrom(service.createReport(payload('new.user@mobireport.com')))).resolves.toBeUndefined();
    const reports = await firstValueFrom(service.getReports());
    expect(reports.some((report) => report.author.email === 'new.user@mobireport.com')).toBe(true);
  });

  it('rejects a duplicate email with the annex 400 payload', async () => {
    await expect(firstValueFrom(service.createReport(payload('j.doe@mobireport.com')))).rejects.toMatchObject({
      status: 400,
      error: { author: { email: ['This value already exist'] } },
    } satisfies Partial<ApiHttpError>);
  });

  it('updates an existing report', async () => {
    await firstValueFrom(
      service.updateReport(1, {
        ...payload('j.doe@mobireport.com'),
        description: 'Description mise à jour',
      }),
    );
    const reports = await firstValueFrom(service.getReports());
    expect(reports.find((report) => report.id === 1)?.description).toBe('Description mise à jour');
  });
});
