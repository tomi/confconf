import type { ConfigProvider } from "../configProvider";

/**
 * A configuration provider that provides a static configuration, given
 * as a parameter to the provider.
 */
class StaticConfig<T> implements ConfigProvider {
  public readonly name = "StaticConfig";

  private readonly staticConfig: Promise<T>;

  constructor(config: T) {
    this.staticConfig = Promise.resolve(config);
  }

  load() {
    return this.staticConfig;
  }
}

export type { StaticConfig };

/**
 * Creates a configuration provider that provides a static configuration, given
 * as a parameter.
 *
 * @example
 * // return Promise<{ port: 3000, hostname: "localhost" }>
 * staticConfig({
 *   port: 3000,
 *   hostname: "localhost"
 * }).load();
 */
export const staticConfig = <T = unknown>(config: T) => new StaticConfig<T>(config);
