import type { GetSecretValueResponse } from "@aws-sdk/client-secrets-manager";

export const createAwsClientMock = (response: GetSecretValueResponse) => ({
  send: jest.fn<any, any>(() => response),
});
