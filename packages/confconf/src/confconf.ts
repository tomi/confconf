import Ajv from "ajv";

import { deepFreeze } from "./utils/deepFreeze";
import { mergeDeep } from "./utils/deepMerge";
import { ValidationError } from "./ValidationError";

import type { ConfigProvider } from "./configProvider";
import type { Schema, ValidateFunction, JSONSchemaType } from "ajv";

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

export interface ConfconfOpts<TSchema extends Schema> {
  /**
   * Schema against which the loaded configuration is validated
   */
  schema: TSchema;

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

class Confconf<TConfig = any, TSchema = any> {
  private readonly freeze: boolean;
  private readonly providers: ConfigProvider[];
  private readonly validator: ValidateFunction<TConfig>;

  constructor(opts: ConfconfOpts<TSchema>) {
    this.freeze = opts.freezeConfig ?? true;
    this.providers = opts.providers;

    this.validator = ajv.compile<TConfig>(opts.schema);
  }

  public addProvider(...provider: ConfigProvider[]) {
    this.providers.push(...provider);
  }

  public async loadAndValidate(): Promise<TConfig> {
    const providedConfigs = await Promise.all(
      this.providers.map((p) => this.loadProviderConfig(p)),
    );

    const mergedConfig = mergeDeep({}, ...providedConfigs);

    if (this.validator(mergedConfig)) {
      return this.freeze ? deepFreeze(mergedConfig) : mergedConfig;
    }

    throw new ValidationError(this.validator.errors ?? []);
  }

  private async loadProviderConfig(provider: ConfigProvider) {
    try {
      return await provider.load();
    } catch (error) {
      console.error(`Failed to load config from ${provider.name}: ${error}`);
    }
  }
}

export type { Confconf };

export type ConfconfFn = {
  <T = any>(opts: ConfconfOpts<JSONSchemaType<T>>): Confconf<T, JSONSchemaType<T>>;
  <TConfig, TSchema extends Schema>(opts: ConfconfOpts<TSchema>): Confconf<TConfig, TSchema>;
};

/**
 * Creates a new instance of confconf
 */
export const confconf: ConfconfFn = (opts: any) => new Confconf(opts);
