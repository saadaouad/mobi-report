import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {
  type ApplicationConfig,
  isDevMode,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { REPORTS_FEATURE_KEY, ReportEffects, reportReducer } from '@reports/store';
import { routes } from './app.routes';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideNativeDateAdapter(),
    provideStore({ [REPORTS_FEATURE_KEY]: reportReducer }),
    provideEffects(ReportEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
  ],
};
