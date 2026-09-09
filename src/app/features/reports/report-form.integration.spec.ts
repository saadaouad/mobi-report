import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { routes } from '../../app.routes';
import { MockApiClient } from '@core/mocks';
import { ReportFormComponent } from '@reports/components';
import { provideReportTesting } from '@testing';

describe('report form integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: provideReportTesting(routes),
    }).compileComponents();

    TestBed.inject(MockApiClient).reset();
  });

  it('creates a report and shows it in the list', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/reports/new');
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(ReportFormComponent))
      .componentInstance as ReportFormComponent;

    form.form.setValue({
      firstName: 'Lea',
      lastName: 'Durand',
      birthDate: new Date(1992, 5, 4),
      sex: 'Femme',
      email: 'lea.durand@mobireport.com',
      description: 'Coupure réseau intermittente',
      observations: [1, 2],
    });
    form.onSubmit();
    await fixture.whenStable();

    await router.navigateByUrl('/reports');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Lea Durand');
    expect(fixture.nativeElement.textContent).toContain('Coupure réseau intermittente');
  });

  it('shows an error when the email already exists', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/reports/new');
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(ReportFormComponent))
      .componentInstance as ReportFormComponent;

    form.form.setValue({
      firstName: 'John',
      lastName: 'Clone',
      birthDate: new Date(1990, 0, 1),
      sex: 'Homme',
      email: 'j.doe@mobireport.com',
      description: 'Doublon email',
      observations: [1],
    });
    form.onSubmit();
    await fixture.whenStable();

    expect(form.form.controls.email.hasError('uniqueEmail')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Cette adresse email existe déjà.');
  });
});
