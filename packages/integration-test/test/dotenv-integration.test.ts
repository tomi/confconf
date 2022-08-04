import { confconf, staticConfig } from "@confconf/confconf-typebox";
import { dotenvConfig } from "@confconf/dotenv";
import { Type } from "@sinclair/typebox";
import * as assert from "assert";
import * as path from "path";
import * as sinon from "sinon";

describe("Integration tests", () => {
  it("loads .env config", async () => {
    const mockCwd = sinon.fake(() => path.join(__dirname, "../test_data/"));

    process.cwd = mockCwd;

    const configLoader = confconf({
      schema: Type.Object({
        VAR1: Type.String(),
        VAR2: Type.Number(),
      }),
      providers: [dotenvConfig()],
    });

    const config = await configLoader.loadAndValidate();
    assert.deepStrictEqual(config, {
      VAR1: "hello",
      VAR2: 10,
    });
  });

  it("doesn't fail even if .env config can't be loaded", async () => {
    const configLoader = confconf({
      schema: Type.Object({
        a: Type.String(),
      }),
      providers: [
        staticConfig({
          a: "hello",
        }),
        dotenvConfig({
          path: "does/not/exist",
        }),
      ],
    });

    const config = await configLoader.loadAndValidate();
    assert.deepStrictEqual(config, {
      a: "hello",
    });
  });
});
