import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter, type Routes } from '@angular/router';
import { MOCK_API_DELAY } from '@core/mocks';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { REPORTS_FEATURE_KEY, ReportEffects, reportReducer } from '@reports/store';

registerLocaleData(localeFr);

export function provideReportTesting(routes: Routes = []) {
  return [
    provideRouter(routes),
    provideNativeDateAdapter(),
    provideStore({ [REPORTS_FEATURE_KEY]: reportReducer }),
    provideEffects(ReportEffects),
    { provide: MOCK_API_DELAY, useValue: 0 },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  ];
}
