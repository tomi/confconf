import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { awsSecretsManagerConfig } from "@confconf/aws-secrets-manager";
import { confconf, staticConfig } from "@confconf/confconf";

describe("Integration tests", () => {
  it("loads aws secrets manager config", async () => {
    const mockSend = jest.fn(() => ({
      ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
      Name: "my/secret",
      CreatedDate: new Date(),
      SecretString: `{ "a": "hello", "b": 10 }`,
    }));

    const mockClient = {
      send: mockSend,
    } as any;

    const configLoader = confconf<{
      a: string;
      b: number;
    }>({
      schema: {
        type: "object",
        properties: {
          a: { type: "string" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
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
    expect(config).toEqual({
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

    const configLoader = confconf<any>({
      schema: {
        type: "object",
        properties: {
          a: { type: "string" },
        },
        required: ["a"],
      },
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
    expect(config).toEqual({
      a: "hello",
    });
  });
});
