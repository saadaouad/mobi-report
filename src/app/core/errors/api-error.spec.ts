import { ApiHttpError, getApiErrorMessage, getFieldErrors, isValidationError } from './api-error';

describe('api error helpers', () => {
  const duplicateEmailError = new ApiHttpError(400, {
    author: { email: ['This value already exist'] },
  });

  it('detects the annex 400 validation payload', () => {
    expect(isValidationError(duplicateEmailError)).toBe(true);
    expect(getFieldErrors(duplicateEmailError)).toEqual({
      email: ['This value already exist'],
    });
  });

  it('returns the API email message for a 400', () => {
    expect(getApiErrorMessage(duplicateEmailError)).toBe('This value already exist');
  });

  it('returns a generic message for unknown errors', () => {
    expect(getApiErrorMessage(new Error('boom'))).toBe(
      'Une erreur est survenue. Veuillez réessayer.',
    );
  });
});
