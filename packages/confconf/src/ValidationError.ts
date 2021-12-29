import type { ErrorObject } from "ajv";

export type { ErrorObject };

export class ValidationError extends Error {
  constructor(public readonly validationErrors: ErrorObject[]) {
    super(`Configuration validation failed: ${validationErrors.map((e) => e.message).join(", ")}`);
  }
}

export const isValidationError = (error: any): error is ValidationError =>
  error instanceof ValidationError;
