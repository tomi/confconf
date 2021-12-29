import { confconf as baseConfconf } from "@confconf/confconf";

import type {
  Confconf,
  ConfconfOpts as BaseConfconfOpts,
  ConfigProvider,
  ConfigStructure,
  ConfigStructureRoot,
  ValidationError,
} from "@confconf/confconf";
import type { TSchema as TTypeboxSchema, Static } from "@sinclair/typebox";

// Re-export all confconf exports
export type { ConfigProvider, ValidationError, ConfigStructure, ConfigStructureRoot };

export * from "@confconf/confconf/dist/devOnlyConfig";
export * from "@confconf/confconf/dist/envConfig";
export * from "@confconf/confconf/dist/staticConfig";

export type ConfconfOpts<TSchema extends TTypeboxSchema> = BaseConfconfOpts<TSchema>;

export type ConfconfTypebox = <TSchema extends TTypeboxSchema>(
  opts: ConfconfOpts<TSchema>,
) => Confconf<Static<TSchema>, TSchema>;

export const confconf: ConfconfTypebox = baseConfconf;
