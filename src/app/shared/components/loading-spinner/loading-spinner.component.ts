import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex min-h-56 flex-col items-center justify-center gap-3 py-12" role="status">
      <mat-spinner diameter="44" />
      <p class="text-sm text-slate-600">Chargement en cours…</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
