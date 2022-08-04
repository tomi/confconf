import * as path from "path";

import { dotenvConfig } from "../src";

describe("dotenvConfig", () => {
  it("loads the secrets correctly from default file", async () => {
    const spy = jest.spyOn(process, "cwd");
    spy.mockReturnValue(path.join(__dirname, "one"));

    const loader = dotenvConfig();

    const loadedSecrets = await loader.load();

    expect(loadedSecrets).toStrictEqual({
      VAR1: "hello",
      VAR2: "world",
    });
  });

  it("loads the secrets from the specified file", async () => {
    const loader = dotenvConfig({
      path: path.join(__dirname, "two/.myenv"),
    });

    const loadedSecrets = await loader.load();

    expect(loadedSecrets).toStrictEqual({
      MY: "hello",
      ENV: "world",
    });
  });

  it("returns no secrets if the specified file doesn't exists", async () => {
    const loader = dotenvConfig({
      path: path.join(__dirname, "two/.doesnotexist"),
    });

    const loadedSecrets = await loader.load();

    expect(loadedSecrets).toStrictEqual({});
  });
});
