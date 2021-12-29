import type { ErrorObject } from "ajv";

export type { ErrorObject };

export class ValidationError extends Error {
  constructor(public readonly validationErrors: ErrorObject[]) {
    super(
      `Configuration validation failed: {${validationErrors
        .map(formatValidationError)
        .join(", ")}}`,
    );
  }
}

export const isValidationError = (error: any): error is ValidationError =>
  error instanceof ValidationError;

function formatValidationError(error: ErrorObject) {
  const instancePath = error.instancePath === "" ? "/" : error.instancePath;

  return `"${instancePath}": "${error.message}"`;
}
