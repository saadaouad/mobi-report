import { Component, input } from '@angular/core';
import { Report } from '@core/models';
import { ReportCardComponent } from '../report-card/report-card.component';

@Component({
  selector: 'app-report-list',
  imports: [ReportCardComponent],
  template: `
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      @for (report of reports(); track report.id) {
        <app-report-card [report]="report" />
      }
    </div>
  `,
})
export class ReportListComponent {
  readonly reports = input.required<Report[]>();
}
