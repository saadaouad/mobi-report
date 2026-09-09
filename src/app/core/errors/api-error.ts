import type { ApiValidationErrorBody, FieldErrors } from '@core/models';

export class ApiHttpError {
  constructor(
    public readonly status: number,
    public readonly error: unknown,
  ) {}
}

export function isApiHttpError(error: unknown): error is ApiHttpError {
  return error instanceof ApiHttpError;
}

export function isValidationError(error: unknown): error is ApiHttpError & {
  error: ApiValidationErrorBody;
} {
  if (!isApiHttpError(error) || error.status !== 400 || !isRecord(error.error)) {
    return false;
  }

  const author = error.error['author'];
  return isRecord(author) && Array.isArray(author['email']);
}

export function getFieldErrors(error: unknown): FieldErrors | null {
  if (!isValidationError(error)) {
    return null;
  }

  return {
    email: error.error.author?.email,
  };
}

export function getApiErrorMessage(error: unknown): string {
  if (isValidationError(error)) {
    return error.error.author?.email?.[0] ?? 'Une erreur de validation est survenue.';
  }

  if (isApiHttpError(error) && error.status === 404) {
    return 'Ressource introuvable.';
  }

  return 'Une erreur est survenue. Veuillez réessayer.';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
