import { confconf as baseConfconf } from "@confconf/confconf";

import type {
  Confconf,
  ConfconfOpts as BaseConfconfOpts,
  ConfigProvider,
  ConfigStructure,
  ConfigStructureRoot,
  ValidationError,
} from "@confconf/confconf";
import type { JSONSchema6 } from "json-schema";
import type { Codec, GetType } from "purify-ts";

// Re-export all confconf exports
export type { ConfigProvider, ValidationError, ConfigStructure, ConfigStructureRoot };

export * from "@confconf/confconf/dist/devOnlyConfig";
export * from "@confconf/confconf/dist/envConfig";
export * from "@confconf/confconf/dist/staticConfig";

export type ConfconfOpts<T> = BaseConfconfOpts<Codec<T>>;

export type ConfconfPurify = <T>(opts: ConfconfOpts<T>) => Confconf<GetType<Codec<T>>, JSONSchema6>;

export const confconf: ConfconfPurify = (opts) =>
  baseConfconf({
    ...opts,
    schema: opts.schema.schema(),
  });
