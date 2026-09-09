import { TestBed } from '@angular/core/testing';
import { MOCK_API_DELAY } from '@core/mocks';
import { firstValueFrom } from 'rxjs';
import { ObservationService } from './observation.service';

describe('ObservationService', () => {
  it('returns the static observations list', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: MOCK_API_DELAY, useValue: 0 }],
    });

    const observations = await firstValueFrom(TestBed.inject(ObservationService).getObservations());
    expect(observations.map((item) => item.name)).toContain('Réseau');
    expect(observations.length).toBeGreaterThanOrEqual(3);
  });
});
