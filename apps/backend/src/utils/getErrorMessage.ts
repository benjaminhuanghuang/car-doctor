/** Safely extract a message string from an unknown thrown value. */
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/** Narrow an unknown error and test its numeric `code` (e.g. Mongo 11000 duplicate key). */
export const hasErrorCode = (error: unknown, code: number): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === code;
