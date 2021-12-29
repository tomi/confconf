export * from "./confconf";
export * from "./staticConfig";
export * from "./envConfig";
export * from "./devOnlyConfig";
export { isValidationError } from "./ValidationError";

import type { ConfigProvider } from "./configProvider";
import type { ErrorObject, ValidationError } from "./ValidationError";
export type { ErrorObject, ValidationError, ConfigProvider };
