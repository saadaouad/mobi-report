import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : startOfDay(value);
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
  }

  return null;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function maxAgeValidator(maxAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const birthDate = parseDate(control.value);
    if (!birthDate) {
      return { invalidDate: true };
    }

    const today = startOfDay(new Date());
    const oldestAllowed = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());

    return birthDate < oldestAllowed ? { maxAge: { maxAge } } : null;
  };
}

export function notFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const date = parseDate(control.value);
    if (!date) {
      return { invalidDate: true };
    }

    return date > startOfDay(new Date()) ? { futureDate: true } : null;
  };
}

export function minSelectedValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return Array.isArray(value) && value.length >= min ? null : { minSelected: { min } };
  };
}

export function uniqueEmailValidator(
  existingEmails: () => readonly string[],
  currentEmail: () => string | null = () => null,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = String(control.value ?? '')
      .trim()
      .toLowerCase();
    if (!email) {
      return null;
    }

    const current = currentEmail()?.trim().toLowerCase() ?? null;
    if (current && email === current) {
      return null;
    }

    return existingEmails().some((item) => item.toLowerCase() === email)
      ? { uniqueEmail: true }
      : null;
  };
}
