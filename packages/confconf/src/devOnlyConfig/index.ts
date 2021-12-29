import type { ConfigProvider } from "../configProvider";

class DevOnlyConfig<T> implements ConfigProvider {
  public readonly name = "DevOnlyConfig";

  private readonly devConfig: Promise<T>;

  constructor(config: T) {
    this.devConfig = Promise.resolve(config);
  }

  public async load() {
    return process.env.NODE_ENV === "development" ? this.devConfig : {};
  }
}

/**
 * Provides the given config only if we are running in development mode
 */
export const devOnlyConfig = <T>(config: T): DevOnlyConfig<T> => new DevOnlyConfig(config);
