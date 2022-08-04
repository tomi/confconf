import { debug } from "debug";
import { parse } from "dotenv";
import { readFile } from "fs/promises";
import * as path from "path";

import type { ConfigProvider } from "@confconf/confconf";

export type DotenvProviderOpts = {
  /**
   * Optional path to the env parameters file
   */
  path?: string;
};

const logger = debug("confconf:dotenv");

export class DotenvProvider<T = unknown> implements ConfigProvider {
  public readonly name = "Dotenv";

  private readonly dotenvPath: string = path.resolve(process.cwd(), ".env");

  constructor(opts: DotenvProviderOpts) {
    if (opts.path) {
      this.dotenvPath = opts.path;
    }
  }

  public async load(): Promise<T> {
    const [loadedVars, error] = await this.loadEnvFile();

    if (loadedVars) {
      return loadedVars;
    }

    if (error) {
      logger(`Failed to load configuration from ${this.dotenvPath}`);
    }

    return {} as T;
  }

  private async loadEnvFile(): Promise<[T, null] | [null, Error]> {
    try {
      // Specifying an encoding returns a string instead of a buffer
      const fileContent = await readFile(this.dotenvPath, { encoding: "utf8" });

      const parsed = parse(fileContent);

      return [parsed as unknown as T, null];
    } catch (e) {
      return [null, e as Error];
    }
  }
}

export const dotenvConfig = <T = unknown>(opts: DotenvProviderOpts = {}) =>
  new DotenvProvider<T>(opts);
