import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

import type { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import type { ConfigProvider } from "@confconf/confconf";

export type TransformFn = (value: any) => any;

export interface SingleSecretConfigFull {
  /**
   * The secret to be loaded.
   *
   * For more details see:
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/interfaces/getsecretvaluecommandinput.html#secretid
   */
  secretId: string;
  /**
   * Unique id of the version of the secret to be loaded.
   *
   * For more details see:
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/interfaces/getsecretvaluecommandinput.html#versionid
   */
  versionId?: string;
  /**
   * Specifies the secret version that you want to retrieve by the staging label attached to the version.
   *
   * For more details see:
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/interfaces/getsecretvaluecommandinput.html#versionstage
   */
  versionStage?: string;
  /**
   * Possible transformation to be applied for the secret
   */
  transform?: TransformFn;
}

/**
 * Configuration for a secret to be loaded. Can either be a secret id
 * (string) or an object with more specific configuration
 */
export type SingleSecretConfig = string | SingleSecretConfigFull;

export interface AwsSecretsManagerProviderOptsBase {
  /**
   * AWS Secrets Manager client to read to secrets with
   */
  client: SecretsManagerClient;
}

export interface AwsSecretsManagerProviderOptsSecret extends AwsSecretsManagerProviderOptsBase {
  /**
   * The secret that should be loaded
   */
  secretToLoad: SingleSecretConfig;
}

export type AwsSecretsManagerProviderOpts = AwsSecretsManagerProviderOptsSecret;

export class AwsSecretsManagerProvider<T = unknown> implements ConfigProvider {
  public readonly name = "AwsSecretsManager";

  private readonly client: SecretsManagerClient;
  private readonly secretToLoad?: SingleSecretConfig;
  constructor(opts: AwsSecretsManagerProviderOpts) {
    this.client = opts.client;

    this.secretToLoad = (opts as AwsSecretsManagerProviderOptsSecret).secretToLoad;
  }

  public async load(): Promise<T> {
    if (this.secretToLoad) {
      return await this.loadSingleSecret(this.secretToLoad);
    }

    return {} as any;
  }

  private async loadSingleSecret(secret: SingleSecretConfig) {
    const secretConfig: SingleSecretConfigFull =
      typeof secret === "string"
        ? {
            secretId: secret,
          }
        : secret;

    const command = new GetSecretValueCommand({
      SecretId: secretConfig.secretId,
      VersionId: secretConfig.versionId,
      VersionStage: secretConfig.versionStage,
    });

    const output = await this.client.send(command);

    const secretValue = output.SecretString ?? output.SecretBinary;

    return secretConfig.transform ? secretConfig.transform(secretValue) : secretValue;
  }
}

export const awsSecretsManagerConfig = <T = unknown>(opts: AwsSecretsManagerProviderOpts) =>
  new AwsSecretsManagerProvider<T>(opts);
