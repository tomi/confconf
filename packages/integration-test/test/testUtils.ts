import { confconf } from "@confconf/confconf";

import type { ConfconfOpts } from "@confconf/confconf";
import type { Static, TSchema as TTypeboxSchema } from "@sinclair/typebox";

export const typeboxConfconf = <TSchema extends TTypeboxSchema>(opts: ConfconfOpts<TSchema>) =>
  confconf<Static<TSchema>, TSchema>(opts);
