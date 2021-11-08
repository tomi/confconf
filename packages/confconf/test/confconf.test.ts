import { Type } from "@sinclair/typebox";

import { confconf, staticConfig } from "../src";

import type { Static } from "@sinclair/typebox";

describe("confconf", () => {
  const defaultSchema = Type.Object({
    a: Type.String(),
    b: Type.String(),
  });

  type Config = Static<typeof defaultSchema>;

  describe("basic functionality", () => {
    it("loads and validates config", async () => {
      const config = confconf({
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
            b: "config",
          }),
        ],
      });

      expect(await config.loadAndValidate()).toEqual({
        a: "hello",
        b: "config",
      });
    });

    it("loads values from all providers when new ones are added", async () => {
      const configLoader = confconf({
        schema: Type.Object({
          a: Type.String(),
          b: Type.String(),
          c: Type.String(),
        }),
        providers: [
          staticConfig({
            a: "hello",
          }),
        ],
      });

      configLoader.addProvider(
        staticConfig({
          b: "config",
        }),
        staticConfig({
          c: "world",
        }),
      );

      expect(await configLoader.loadAndValidate()).toEqual({
        a: "hello",
        b: "config",
        c: "world",
      });
    });
  });

  describe("configuration validation", () => {
    it("removes values outside the schema", async () => {
      const config = confconf({
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
            b: "config",
            c: "removed",
            d: {
              d1: "also removed",
            },
          }),
        ],
      });

      expect(await config.loadAndValidate()).toEqual({
        a: "hello",
        b: "config",
      });
    });

    it("throws an error if loaded config has a missing value", async () => {
      const config = confconf({
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
          }),
        ],
      });

      await expect(() => config.loadAndValidate()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Configuration validation failed"`,
      );
    });
  });

  describe("configuration merging", () => {
    it("later provided config takes precedence", async () => {
      const config = confconf({
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
            b: "config",
          }),
          staticConfig({
            b: "later",
          }),
        ],
      });

      expect(await config.loadAndValidate()).toEqual({
        a: "hello",
        b: "later",
      });
    });
  });

  describe("type coercion", () => {
    describe("string to number", () => {
      const schemaWithNumber = Type.Object({
        a: Type.Number(),
      });

      it("coerces an integer", async () => {
        const config = confconf({
          schema: schemaWithNumber,
          providers: [
            staticConfig({
              a: "10",
            }),
          ],
        });

        expect(await config.loadAndValidate()).toEqual({
          a: 10,
        });
      });

      it("coerces a decimal number", async () => {
        const config = confconf({
          schema: schemaWithNumber,
          providers: [
            staticConfig({
              a: "10.23",
            }),
          ],
        });

        expect(await config.loadAndValidate()).toEqual({
          a: 10.23,
        });
      });

      it("fails if the number is invalid", async () => {
        const config = confconf({
          schema: schemaWithNumber,
          providers: [
            staticConfig({
              a: "1,0",
            }),
          ],
        });

        await expect(async () => await config.loadAndValidate()).rejects.toThrow();
      });
    });

    describe("string to boolean", () => {
      const schemaWithBoolean = Type.Object({
        a: Type.Boolean(),
      });

      it("coerces true", async () => {
        const config = confconf({
          schema: schemaWithBoolean,
          providers: [
            staticConfig({
              a: "true",
            }),
          ],
        });

        expect(await config.loadAndValidate()).toEqual({
          a: true,
        });
      });

      it("coerces false", async () => {
        const config = confconf({
          schema: schemaWithBoolean,
          providers: [
            staticConfig({
              a: "false",
            }),
          ],
        });

        expect(await config.loadAndValidate()).toEqual({
          a: false,
        });
      });
    });
  });

  describe("configuration freezing", () => {
    it("the configuration is frozen by default when it's loaded", async () => {
      const configLoader = confconf<Config>({
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
            b: "config",
          }),
        ],
      });

      const config = await configLoader.loadAndValidate();

      expect(() => (config.a = "throws")).toThrow();
    });

    it("is not frozen if specified so", async () => {
      const configLoader = confconf<Config>({
        freezeConfig: false,
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
            b: "config",
          }),
        ],
      });

      const config = await configLoader.loadAndValidate();
      config.a = "2nd";
      config.b = "3rd";

      expect(config).toEqual({
        a: "2nd",
        b: "3rd",
      });
    });
  });
});
