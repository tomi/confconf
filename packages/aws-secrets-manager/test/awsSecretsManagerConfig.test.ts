import { awsSecretsManagerConfig } from "../src";
import { createAwsClientMock } from "./__mocks__/awsClientMock";

import type { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

describe("awsSecretsManagerConfig", () => {
  describe("loading a secret defined only by its id", () => {
    describe("loading a string secret", () => {
      const awsClientMock = createAwsClientMock({
        ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
        Name: "my/secret",
        CreatedDate: new Date(),
        SecretString: "secret value",
      });

      it("loads the secret correctly", async () => {
        const loader = awsSecretsManagerConfig({
          client: awsClientMock as unknown as SecretsManagerClient,
          secretToLoad: "my/secret",
        });

        const loadedSecret = await loader.load();

        expect(loadedSecret).toEqual("secret value");
      });

      it("sends correct command to the client", () => {
        expect(awsClientMock.send).toHaveBeenCalledTimes(1);

        const args = awsClientMock.send.mock.calls[0] as any;
        expect(args[0].input).toEqual({
          SecretId: "my/secret",
          VersionId: undefined,
          VersionStage: undefined,
        });
      });
    });

    describe("loading a binary secret", () => {
      const binarySecret = Buffer.from("secret value");
      const awsClientMock = createAwsClientMock({
        ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
        Name: "my/secret",
        CreatedDate: new Date(),
        SecretBinary: binarySecret,
      });

      it("loads the secret correctly", async () => {
        const loader = awsSecretsManagerConfig({
          client: awsClientMock as unknown as SecretsManagerClient,
          secretToLoad: "my/secret",
        });

        const loadedSecret = await loader.load();

        expect(loadedSecret).toEqual(binarySecret);
      });
    });
  });

  describe("loading a secret by full definition", () => {
    describe("loading a secret with only id defined", () => {
      const awsClientMock = createAwsClientMock({
        ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
        Name: "my/secret",
        CreatedDate: new Date(),
        SecretString: "secret value",
      });

      it("loads the secret correctly", async () => {
        const loader = awsSecretsManagerConfig({
          client: awsClientMock as unknown as SecretsManagerClient,
          secretToLoad: {
            secretId: "my/secret",
          },
        });

        const loadedSecret = await loader.load();

        expect(loadedSecret).toEqual("secret value");
      });

      it("sends correct command to the client", () => {
        expect(awsClientMock.send).toHaveBeenCalledTimes(1);

        const args = awsClientMock.send.mock.calls[0] as any;
        expect(args[0].input).toEqual({
          SecretId: "my/secret",
          VersionId: undefined,
          VersionStage: undefined,
        });
      });
    });

    describe("loading a secret with id and version id", () => {
      const awsClientMock = createAwsClientMock({
        ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
        Name: "my/secret",
        CreatedDate: new Date(),
        SecretString: "secret value",
        VersionId: "abc-123",
      });

      it("loads the secret correctly", async () => {
        const loader = awsSecretsManagerConfig({
          client: awsClientMock as unknown as SecretsManagerClient,
          secretToLoad: {
            secretId: "my/secret",
            versionId: "abc-123",
          },
        });

        const loadedSecret = await loader.load();

        expect(loadedSecret).toEqual("secret value");
      });

      it("sends correct command to the client", () => {
        expect(awsClientMock.send).toHaveBeenCalledTimes(1);

        const args = awsClientMock.send.mock.calls[0] as any;
        expect(args[0].input).toEqual({
          SecretId: "my/secret",
          VersionId: "abc-123",
          VersionStage: undefined,
        });
      });
    });

    describe("loading a secret with id and version stage", () => {
      const awsClientMock = createAwsClientMock({
        ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
        Name: "my/secret",
        CreatedDate: new Date(),
        SecretString: "secret value",
        VersionStages: ["abc-123"],
      });

      it("loads the secret correctly", async () => {
        const loader = awsSecretsManagerConfig({
          client: awsClientMock as unknown as SecretsManagerClient,
          secretToLoad: {
            secretId: "my/secret",
            versionStage: "abc-123",
          },
        });

        const loadedSecret = await loader.load();

        expect(loadedSecret).toEqual("secret value");
      });

      it("sends correct command to the client", () => {
        expect(awsClientMock.send).toHaveBeenCalledTimes(1);

        const args = awsClientMock.send.mock.calls[0] as any;
        expect(args[0].input).toEqual({
          SecretId: "my/secret",
          VersionStage: "abc-123",
        });
      });
    });

    describe("loading a secret with transformation", () => {
      const awsClientMock = createAwsClientMock({
        ARN: "arn:aws:secretsmanager:eu-north-1:012345678901:secret:my/secret-9UQJHc",
        Name: "my/secret",
        CreatedDate: new Date(),
        SecretString: "secret value",
      });

      it("loads the secret correctly", async () => {
        const mockTransform = jest.fn(() => "hijacked secret");
        const loader = awsSecretsManagerConfig({
          client: awsClientMock as unknown as SecretsManagerClient,
          secretToLoad: {
            secretId: "my/secret",
            transform: mockTransform,
          },
        });

        const loadedSecret = await loader.load();

        expect(loadedSecret).toEqual("hijacked secret");

        expect(mockTransform).toHaveBeenCalledTimes(1);

        const args = mockTransform.mock.calls[0] as any;
        expect(args[0]).toEqual("secret value");
      });

      it("sends correct command to the client", () => {
        expect(awsClientMock.send).toHaveBeenCalledTimes(1);

        const args = awsClientMock.send.mock.calls[0] as any;
        expect(args[0].input).toEqual({
          SecretId: "my/secret",
          VersionId: undefined,
          VersionStage: undefined,
        });
      });
    });
  });
});
