import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  template: `
    <div class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <mat-icon class="mb-3 text-slate-400" aria-hidden="true">inbox</mat-icon>
      <h2 class="text-lg font-semibold text-slate-900">{{ title() }}</h2>
      <p class="mx-auto mt-2 max-w-md text-sm text-slate-600">{{ message() }}</p>
      <div class="mt-5">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input('Aucun signalement');
  readonly message = input('Créez le premier signalement pour commencer le suivi.');
}
