import { InjectionToken } from '@angular/core';

/** Simulated HTTP latency in milliseconds. Tests override this to 0. */
export const MOCK_API_DELAY = new InjectionToken<number>('MOCK_API_DELAY', {
  providedIn: 'root',
  factory: () => 450,
});
