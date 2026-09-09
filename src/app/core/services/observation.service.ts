import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MockApiClient } from '../mocks/mock-api.client';
import { Observation } from '../models/observation.model';

@Injectable({ providedIn: 'root' })
export class ObservationService {
  private readonly api = inject(MockApiClient);

  getObservations(): Observable<Observation[]> {
    return this.api.get<Observation[]>('/observations');
  }
}
