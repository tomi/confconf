import { confconf } from "../src";

import type { ConfconfOpts } from "../src";
import type { JSONSchema6 } from "json-schema";
import type { Codec, GetType } from "purify-ts";

export type PurifyConfconfOpts<T> = ConfconfOpts<Codec<T>>;

export const purifyConfconf = <T>(opts: PurifyConfconfOpts<T>) =>
  confconf<GetType<Codec<T>>, JSONSchema6>({
    ...opts,
    schema: opts.schema.schema(),
  });
