import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="max-w-2xl text-sm text-slate-600 sm:text-base">{{ subtitle() }}</p>
        }
      </div>
      <div class="shrink-0">
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
