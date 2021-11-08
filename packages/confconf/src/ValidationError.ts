import type { ErrorObject } from "ajv";

export class ValidationError extends Error {
  constructor(public readonly validationErrors: ErrorObject[]) {
    super(`Configuration validation failed: ${validationErrors.map((e) => e.message).join(", ")}`);
  }
}
