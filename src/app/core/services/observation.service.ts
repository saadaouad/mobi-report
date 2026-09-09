import { Injectable, inject } from '@angular/core';
import { MockApiClient } from '@core/mocks';
import type { Observation } from '@core/models';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ObservationService {
  private readonly api = inject(MockApiClient);

  getObservations(): Observable<Observation[]> {
    return this.api.get<Observation[]>('/observations');
  }
}
