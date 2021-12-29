import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { awsSecretsManagerConfig } from "@confconf/aws-secrets-manager";
import { confconf, staticConfig } from "@confconf/confconf-typebox";
import { Type } from "@sinclair/typebox";
import * as assert from "assert";
import * as sinon from "sinon";

describe("Integration tests", () => {
  it("loads aws secrets manager config", async () => {
    const mockSend = sinon.fake(() => ({
      ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
      Name: "my/secret",
      CreatedDate: new Date(),
      SecretString: `{ "a": "hello", "b": 10 }`,
    }));

    const mockClient = {
      send: mockSend,
    } as any;

    const configLoader = confconf({
      schema: Type.Object({
        a: Type.String(),
        b: Type.Number(),
      }),
      providers: [
        awsSecretsManagerConfig({
          client: mockClient,
          secretToLoad: {
            secretId: "my/secret",
            transform: JSON.parse,
          },
        }),
      ],
    });

    const config = await configLoader.loadAndValidate();
    assert.deepStrictEqual(config, {
      a: "hello",
      b: 10,
    });
  });

  it("doesn't fail even if aws secrets manager can't load a secret", async () => {
    const client = new SecretsManagerClient({
      credentials: {
        accessKeyId: "dummyvalue",
        secretAccessKey: "dummyvalue",
      },
    });

    const configLoader = confconf({
      schema: Type.Object({
        a: Type.String(),
      }),
      providers: [
        staticConfig({
          a: "hello",
        }),
        awsSecretsManagerConfig({
          client,
          secretToLoad: {
            secretId: "my/secret",
          },
        }),
      ],
    });

    const config = await configLoader.loadAndValidate();
    assert.deepStrictEqual(config, {
      a: "hello",
    });
  });
});
