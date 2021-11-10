# confconf AWS Secrets Manager configuration provider

## Features

## Install

```bash
npm i --save @confconf/aws-secrets-manager
```

## Usage

```ts
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { confconf } from "@confconf/confconf";
import { awsSecretsManager } from "@confconf/aws-secrets-manager";

// Create an aws secrets manager client
const client = new SecretsManagerClient();

// Define a schema
const configSchema = {
  // ...
};
type Config = {
  // ...
};

// Create the configuration loader
const configLoader = confconf<Config>({
  schema: configSchema,
  providers: [
    awsSecretsManager({
      client,
      secretToLoad: "name/of/the/secret",
    }),
  ],
});

// Load configuration and validate it against the schema
const config = await configLoader.loadAndValidate();
```

## API reference

### `awsSecretsManager(opts: AwsSecretsManagerProviderOpts)`

Creates a new instance of the AWS secrets Manager configuration provider

#### `opts` [AwsSecretsManagerProviderOpts]

```ts
interface AwsSecretsManagerProviderOpts {
  /**
   * AWS Secrets Manager client to read to secrets with
   */
  client: SecretsManagerClient;

  /**
   * The secret that should be loaded. Can either be a secret id
   * (string) or an object with more specific configuration
   */
  secretToLoad:
    | string
    | {
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
      };
}
```
