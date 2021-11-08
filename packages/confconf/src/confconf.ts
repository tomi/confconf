import Ajv from "ajv";

import { deepFreeze } from "./utils/deepFreeze";
import { mergeDeep } from "./utils/deepMerge";
import { ValidationError } from "./ValidationError";

import type { ConfigProvider } from "./configProvider";
import type { Schema, ValidateFunction } from "ajv";

const ajv = new Ajv({
  strict: true,
  coerceTypes: true,
  removeAdditional: "all",
}).addVocabulary([
  // typebox uses these internally so we need to allow it to be able
  // to use strict mode.
  // See https://githubmemory.com/repo/sinclairzx81/typebox/issues/51
  "kind",
  "modifier",
]);

export interface ConfconfOpts {
  /**
   * Schema against which the loaded configuration is validated
   */
  schema: Schema;

  /**
   * List of providers from which the configuration is loaded from
   * and merged
   */
  providers: ConfigProvider[];

  /**
   * Should the configuration frozen after it has been loaded and merged
   *
   * @default true
   */
  freezeConfig?: boolean;
}

class Confconf<TConfig> {
  private readonly freeze: boolean;
  private readonly providers: ConfigProvider[];
  private readonly validator: ValidateFunction<TConfig>;

  constructor(opts: ConfconfOpts) {
    this.freeze = opts.freezeConfig ?? true;
    this.providers = opts.providers;

    this.validator = ajv.compile<TConfig>(opts.schema);
  }

  public addProvider(...provider: ConfigProvider[]) {
    this.providers.push(...provider);
  }

  public async loadAndValidate(): Promise<TConfig> {
    const providedConfigs = await Promise.all(this.providers.map((p) => p.load()));

    const mergedConfig = mergeDeep({}, ...providedConfigs);

    if (this.validator(mergedConfig)) {
      return this.freeze ? deepFreeze(mergedConfig) : mergedConfig;
    }

    throw new ValidationError(this.validator.errors ?? []);
  }
}

/**
 * Creates a new instance of confconf
 */
export const confconf = <TConfig>(opts: ConfconfOpts) => new Confconf<TConfig>(opts);
