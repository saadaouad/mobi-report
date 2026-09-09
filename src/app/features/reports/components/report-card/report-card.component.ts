import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Report } from '../../../../core/models/report.model';

@Component({
  selector: 'app-report-card',
  imports: [DatePipe, MatButtonModule, MatChipsModule, MatIconModule, RouterLink],
  template: `
    <article
      class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:shadow-md"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">
            {{ report().author.first_name }} {{ report().author.last_name }}
          </h2>
          <p class="mt-1 text-sm text-slate-600">{{ report().author.email }}</p>
        </div>
        <span class="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800">
          {{ report().author.sex }}
        </span>
      </div>

      <p class="mt-4 flex-1 text-sm leading-6 text-slate-700">{{ report().description }}</p>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <mat-chip-set>
          @for (observation of report().observations; track observation.id) {
            <mat-chip>{{ observation.name }}</mat-chip>
          }
        </mat-chip-set>
        <p class="text-xs text-slate-500">
          Né(e) le {{ report().author.birth_date | date: 'dd/MM/yyyy' }}
        </p>
      </div>

      <div class="mt-5 flex justify-end">
        <a matButton="outlined" [routerLink]="['/reports', report().id, 'edit']">
          <mat-icon>edit</mat-icon>
          Modifier
        </a>
      </div>
    </article>
  `,
})
export class ReportCardComponent {
  readonly report = input.required<Report>();
}
