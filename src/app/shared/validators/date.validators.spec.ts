import { FormControl } from '@angular/forms';
import {
  maxAgeValidator,
  minSelectedValidator,
  notFutureDateValidator,
  toIsoDate,
  uniqueEmailValidator,
} from './date.validators';

describe('maxAgeValidator', () => {
  const validator = maxAgeValidator(100);

  it('accepts an empty value', () => {
    expect(validator(new FormControl(null))).toBeNull();
  });

  it('accepts a recent birth date', () => {
    expect(validator(new FormControl(new Date(1990, 0, 1)))).toBeNull();
  });

  it('rejects a birth date older than 100 years', () => {
    const tooOld = new Date();
    tooOld.setFullYear(tooOld.getFullYear() - 101);
    expect(validator(new FormControl(tooOld))).toEqual({ maxAge: { maxAge: 100 } });
  });
});

describe('notFutureDateValidator', () => {
  it('rejects a future date', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(notFutureDateValidator()(new FormControl(tomorrow))).toEqual({ futureDate: true });
  });
});

describe('minSelectedValidator', () => {
  it('rejects an empty array', () => {
    expect(minSelectedValidator(1)(new FormControl([]))).toEqual({ minSelected: { min: 1 } });
  });

  it('accepts a non-empty selection', () => {
    expect(minSelectedValidator(1)(new FormControl([1]))).toBeNull();
  });
});

describe('uniqueEmailValidator', () => {
  it('rejects an email already present in the list', () => {
    const control = new FormControl('j.doe@mobireport.com');
    const validator = uniqueEmailValidator(() => ['j.doe@mobireport.com']);
    expect(validator(control)).toEqual({ uniqueEmail: true });
  });

  it('allows the current report email when editing', () => {
    const validator = uniqueEmailValidator(
      () => ['j.doe@mobireport.com'],
      () => 'j.doe@mobireport.com',
    );
    expect(validator(new FormControl('j.doe@mobireport.com'))).toBeNull();
  });
});

describe('toIsoDate', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(toIsoDate(new Date(1990, 0, 1))).toBe('1990-01-01');
  });
});
