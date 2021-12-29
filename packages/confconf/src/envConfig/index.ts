import { mergeDeep } from "../utils/deepMerge";

import type { ConfigProvider } from "../configProvider";

export type ConfigStructure =
  | string
  | {
      [key: string]: string | ConfigStructure;
    };

export type ConfigStructureRoot = Record<string, ConfigStructure>;

export interface EnvConfigOpts {
  /**
   * Load only environment variables with given prefix
   */
  prefix?: string;

  /**
   * The structure into which the environment variables are loaded into
   */
  structure?: ConfigStructureRoot;
}

type Env = Record<string, string | undefined>;

class EnvConfig implements ConfigProvider {
  public readonly name = "EnvConfig";

  constructor(private readonly opts: EnvConfigOpts = {}) {}

  load(): Promise<unknown> {
    const { structure } = this.opts;
    const env = this.loadEnvVariables();

    return Promise.resolve(structure ? this.createStructure({}, structure, env) : env);
  }

  private loadEnvVariables() {
    const { prefix } = this.opts;

    if (!prefix) {
      return mergeDeep<Env>(undefined, {}, process.env);
    }

    return Object.keys(process.env)
      .filter((key) => key.startsWith(prefix))
      .reduce<Env>((env, key) => {
        env[key] = process.env[key];

        return env;
      }, {});
  }

  private createStructure(target: any, structure: ConfigStructureRoot, env: Env) {
    for (const key in structure) {
      const value = structure[key];
      if (typeof value === "string") {
        Object.assign(target, { [key]: env[value] });
      } else {
        if (!target[key]) Object.assign(target, { [key]: {} });
        this.createStructure(target[key], value, env);
      }
    }

    return target;
  }
}

export type { EnvConfig };

/**
 * Creates a configuration provider that loads configuration from environment
 * variables
 */
export const envConfig = (opts?: EnvConfigOpts) => new EnvConfig(opts);
