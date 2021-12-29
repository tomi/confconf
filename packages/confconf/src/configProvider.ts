/**
 * A configuration provider that can load configuration
 * from some source
 */
export interface ConfigProvider {
  readonly name: string;

  /**
   * Load configuration from the provider's source
   */
  load(): Promise<unknown>;
}
