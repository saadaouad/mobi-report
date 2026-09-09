import { Observation } from './observation.model';

export type Sex = 'Homme' | 'Femme' | 'Non-binaire';

export const SEX_OPTIONS: readonly Sex[] = ['Homme', 'Femme', 'Non-binaire'];

export interface Author {
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  sex: Sex;
}

/** Domain model returned by GET /reporting. */
export interface Report {
  id: number;
  author: Author;
  observations: Observation[];
  description: string;
}

/**
 * POST / PUT /reporting body.
 * The annex uses `sexe` on write and `sex` on read — the mock API maps both.
 */
export interface CreateReportPayload {
  author: {
    first_name: string;
    last_name: string;
    birth_date: string;
    sexe: Sex;
    email: string;
  };
  description: string;
  observations: number[];
}

export interface ApiValidationErrorBody {
  author?: {
    email?: string[];
  };
}

export interface FieldErrors {
  email?: string[];
}
