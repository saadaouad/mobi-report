import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { By } from '@angular/platform-browser';
import { OBSERVATIONS_MOCK } from '@core/mocks';
import { ReportFormComponent } from './report-form.component';

describe('ReportFormComponent', () => {
  let fixture: ComponentFixture<ReportFormComponent>;
  let component: ReportFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFormComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('observations', OBSERVATIONS_MOCK);
    await fixture.whenStable();
  });

  it('should display a validation error when first name is empty', async () => {
    component.form.controls.firstName.markAsTouched();
    component.form.controls.firstName.updateValueAndValidity();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Le prénom est obligatoire.');
  });

  it('should reject names longer than 50 characters', () => {
    component.form.controls.firstName.setValue('A'.repeat(51));
    expect(component.form.controls.firstName.hasError('maxlength')).toBe(true);
  });

  it('should reject a birth date older than 100 years', () => {
    const tooOld = new Date();
    tooOld.setFullYear(tooOld.getFullYear() - 101);
    component.form.controls.birthDate.setValue(tooOld);
    expect(component.form.controls.birthDate.hasError('maxAge')).toBe(true);
  });

  it('should disable submit when the form is invalid', () => {
    expect(component.form.invalid).toBe(true);
    const submit = fixture.debugElement.query(By.css('[data-testid="submit-report"]'));
    expect(submit).toBeTruthy();
    component.onSubmit();
    expect(component.form.touched).toBe(true);
  });

  it('should submit selected observations', () => {
    const emitted: unknown[] = [];
    component.submitted.subscribe((payload) => emitted.push(payload));

    component.form.setValue({
      firstName: 'Lea',
      lastName: 'Durand',
      birthDate: new Date(1992, 5, 4),
      sex: 'Femme',
      email: 'lea.durand@mobireport.com',
      description: 'Coupure réseau intermittente',
      observations: [1, 2],
    });

    component.onSubmit();

    expect(emitted[0]).toMatchObject({
      author: {
        first_name: 'Lea',
        last_name: 'Durand',
        sexe: 'Femme',
        email: 'lea.durand@mobireport.com',
      },
      observations: [1, 2],
    });
  });
});
