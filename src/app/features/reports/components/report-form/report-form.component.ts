import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Observation } from '../../../../core/models/observation.model';
import {
  CreateReportPayload,
  FieldErrors,
  Report,
  SEX_OPTIONS,
  Sex,
} from '../../../../core/models/report.model';
import {
  maxAgeValidator,
  minSelectedValidator,
  notFutureDateValidator,
  parseDate,
  startOfDay,
  toIsoDate,
  uniqueEmailValidator,
} from '../../../../shared/validators/date.validators';
import { ObservationChipsComponent } from '../observation-chips/observation-chips.component';

@Component({
  selector: 'app-report-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ObservationChipsComponent,
  ],
  templateUrl: './report-form.component.html',
})
export class ReportFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly observations = input<Observation[]>([]);
  readonly existingEmails = input<readonly string[]>([]);
  readonly currentEmail = input<string | null>(null);
  readonly saving = input(false);
  readonly saveError = input<string | null>(null);
  readonly fieldErrors = input<FieldErrors | null>(null);
  readonly initialReport = input<Report | null>(null);
  readonly submitLabel = input('Enregistrer le signalement');

  readonly submitted = output<CreateReportPayload>();
  readonly cancelled = output<void>();

  readonly sexOptions = SEX_OPTIONS;
  readonly today = startOfDay(new Date());
  readonly oldestBirthDate = new Date(
    this.today.getFullYear() - 100,
    this.today.getMonth(),
    this.today.getDate(),
  );

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    birthDate: this.fb.control<Date | null>(null, {
      validators: [Validators.required, maxAgeValidator(100), notFutureDateValidator()],
    }),
    sex: this.fb.control<Sex>('Homme', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        uniqueEmailValidator(
          () => this.existingEmails(),
          () => this.currentEmail(),
        ),
      ],
    ],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    observations: this.fb.control<number[]>([], {
      validators: [minSelectedValidator(1)],
      nonNullable: true,
    }),
  });

  private patchedId: number | null = null;

  constructor() {
    effect(() => {
      this.existingEmails();
      this.form.controls.email.updateValueAndValidity({ emitEvent: false });
    });

    effect(() => {
      const report = this.initialReport();
      if (report && report.id !== this.patchedId) {
        this.patchedId = report.id;
        this.patchForm(report);
      }
    });

    effect(() => {
      const fieldErrors = this.fieldErrors();
      if (fieldErrors?.email?.length) {
        this.form.controls.email.setErrors({
          ...(this.form.controls.email.errors ?? {}),
          uniqueEmail: true,
        });
      }
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) {
      return;
    }

    const value = this.form.getRawValue();
    const birthDate = value.birthDate;
    if (!birthDate) {
      return;
    }

    this.submitted.emit({
      author: {
        first_name: value.firstName.trim(),
        last_name: value.lastName.trim(),
        birth_date: toIsoDate(birthDate),
        sexe: value.sex,
        email: value.email.trim(),
      },
      description: value.description.trim(),
      observations: value.observations,
    });
  }

  private patchForm(report: Report): void {
    this.form.patchValue({
      firstName: report.author.first_name,
      lastName: report.author.last_name,
      birthDate: parseDate(report.author.birth_date),
      sex: report.author.sex,
      email: report.author.email,
      description: report.description,
      observations: report.observations.map((observation) => observation.id),
    });
  }
}
