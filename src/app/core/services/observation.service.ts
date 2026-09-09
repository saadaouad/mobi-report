import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MockApiClient } from '@core/mocks';
import { Observation } from '@core/models';

@Injectable({ providedIn: 'root' })
export class ObservationService {
  private readonly api = inject(MockApiClient);

  getObservations(): Observable<Observation[]> {
    return this.api.get<Observation[]>('/observations');
  }
}
