/**
 * A configuration provider that can load configuration
 * from some source
 */
export interface ConfigProvider {
  /**
   * Load configuration from the provider's source
   */
  load(): Promise<unknown>;
}
