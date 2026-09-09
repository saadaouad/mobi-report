import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { REPORTS_MOCK } from '@core/mocks';
import { ReportListComponent } from './report-list.component';

registerLocaleData(localeFr);

describe('ReportListComponent', () => {
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportListComponent],
      providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'fr-FR' }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportListComponent);
    fixture.componentRef.setInput('reports', REPORTS_MOCK);
    await fixture.whenStable();
  });

  it('renders a card for each report', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('John Doe');
    expect(text).toContain('j.doe@mobireport.com');
    expect(text).toContain('Un soucis sur mon réseau');
  });
});
