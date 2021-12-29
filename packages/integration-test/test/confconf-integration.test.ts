import {
  confconf,
  envConfig,
  staticConfig,
  devOnlyConfig,
  isValidationError,
} from "@confconf/confconf";
import * as assert from "assert";

import type { ConfigProvider, ErrorObject } from "@confconf/confconf";

describe("Integration tests", () => {
  describe("core providers", () => {
    it("loads static config", async () => {
      type Config = {
        a: string;
        b: number;
      };

      const configLoader = confconf<Config>({
        schema: {
          type: "object",
          properties: {
            a: { type: "string" },
            b: { type: "number" },
          },
          required: ["a", "b"],
        },
        providers: [
          staticConfig({
            a: "hello",
            b: 10,
          }),
        ],
      });

      const config = await configLoader.loadAndValidate();
      assert.deepStrictEqual(config, {
        a: "hello",
        b: 10,
      });

      // Typescript test
      config.a;
      config.b;
    });

    it("loads env config", async () => {
      process.env = {
        VAR_A: "hello",
        VAR_B: "10",
      };

      type Config = {
        a: string;
        b: number;
      };

      const configLoader = confconf<Config>({
        schema: {
          type: "object",
          properties: {
            a: { type: "string" },
            b: { type: "number" },
          },
          required: ["a", "b"],
        },
        providers: [
          envConfig({
            structure: {
              a: "VAR_A",
              b: "VAR_B",
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

    it("loads dev only config", async () => {
      process.env.NODE_ENV = "development";

      type Config = {
        a: string;
      };

      const configLoader = confconf<Config>({
        schema: {
          type: "object",
          properties: {
            a: { type: "string" },
          },
          required: ["a"],
        },
        providers: [
          devOnlyConfig({
            a: "hello",
          }),
        ],
      });

      const config = await configLoader.loadAndValidate();
      assert.deepStrictEqual(config, {
        a: "hello",
      });
    });
  });

  describe("error checking", () => {
    it("throws ValidationError that can be checked with isValidationError", async () => {
      let error: any = null;

      try {
        await confconf({
          providers: [],
          schema: { type: "object", properties: { a: { type: "string" } }, required: ["a"] },
        }).loadAndValidate();
      } catch (e) {
        error = e;
      }

      assert.strictEqual(
        isValidationError(error),
        true,
        "error should be instanceof ValidationError",
      );
    });
  });

  describe("exported types", () => {
    it("exports certain types", () => {
      // typescript checks
      const a: ErrorObject = {} as any;
      a.message;

      const b: ConfigProvider = {} as any;
      b.name;
    });
  });
});
