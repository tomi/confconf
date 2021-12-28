import { confconf } from "../src";

import type { ConfconfOpts } from "../src";
import type { Static, TSchema as TTypeboxSchema } from "@sinclair/typebox";
import type { JSONSchema6 } from "json-schema";
import type { Codec, GetType } from "purify-ts";

export const typeboxConfconf = <TSchema extends TTypeboxSchema>(opts: ConfconfOpts<TSchema>) =>
  confconf<Static<TSchema>, TSchema>(opts);

export type PurifyConfconfOpts<T> = ConfconfOpts<Codec<T>>;

export const purifyConfconf = <T>(opts: PurifyConfconfOpts<T>) =>
  confconf<GetType<Codec<T>>, JSONSchema6>({
    ...opts,
    schema: opts.schema.schema(),
  });
