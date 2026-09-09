import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
      role="alert"
    >
      <mat-icon class="mb-3 text-red-600" aria-hidden="true">error_outline</mat-icon>
      <h2 class="text-lg font-semibold text-red-900">Une erreur est survenue</h2>
      <p class="mx-auto mt-2 max-w-md text-sm text-red-800">{{ message() }}</p>
      @if (retryable()) {
        <button class="mt-5" matButton="filled" type="button" (click)="retry.emit()">
          Réessayer
        </button>
      }
    </div>
  `,
})
export class ErrorStateComponent {
  readonly message = input.required<string>();
  readonly retryable = input(true);
  readonly retry = output<void>();
}
