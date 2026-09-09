import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { routes } from '../../app.routes';
import { MockApiClient } from '../../core/mocks/mock-api.client';
import { provideReportTesting } from '../../testing/report-testing';

describe('report list integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: provideReportTesting(routes),
    }).compileComponents();

    TestBed.inject(MockApiClient).reset();
  });

  it('lists existing reports and navigates to the creation page', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/reports');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('John Doe');
    expect(fixture.nativeElement.textContent).toContain('Signalements');

    const createLink = fixture.debugElement.query(By.css('[data-testid="new-report"]'));
    expect(createLink).toBeTruthy();

    await router.navigateByUrl('/reports/new');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Nouveau signalement');
  });
});
