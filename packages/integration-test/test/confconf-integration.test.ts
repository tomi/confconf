import { confconf, envConfig, staticConfig, devOnlyConfig } from "@confconf/confconf";
import { Codec, number, string } from "purify-ts/Codec";

import type { ConfconfOpts } from "@confconf/confconf";
import type { JSONSchema6 } from "json-schema";
import type { GetType } from "purify-ts";

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
      expect(config).toEqual({
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
      expect(config).toEqual({
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
      expect(config).toEqual({
        a: "hello",
      });
    });
  });

  describe("purify-ts integration", () => {
    type PurifyConfconfOpts<T> = ConfconfOpts<Codec<T>>;

    const purifyConfconf = <T>(opts: PurifyConfconfOpts<T>) =>
      confconf<GetType<Codec<T>>, JSONSchema6>({
        ...opts,
        schema: opts.schema.schema(),
      });

    it("works with purify-ts", async () => {
      const configLoader = purifyConfconf({
        schema: Codec.interface({
          a: string,
          b: number,
        }),
        providers: [
          staticConfig({
            a: "hello",
            b: "10",
          }),
        ],
      });

      const config = await configLoader.loadAndValidate();
      expect(config).toEqual({
        a: "hello",
        b: 10,
      });

      // typescript checks
      config.a;
      config.b;
    });
  });
});
