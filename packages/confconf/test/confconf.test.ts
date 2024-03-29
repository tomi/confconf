import { confconf, isValidationError, staticConfig } from "../src";

import type { ConfigProvider, ValidationError } from "../src";
import type { JSONSchemaType } from "ajv";

type Config = {
  a: string;
  b: string;
};

const defaultSchema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    a: { type: "string" },
    b: { type: "string" },
  },
  required: ["a", "b"],
};

describe("confconf", () => {
  describe("basic functionality", () => {
    it("loads and validates config", async () => {
      const config = confconf<Config>({
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
      const configLoader = confconf<{
        a: string;
        b: string;
        c: string;
      }>({
        schema: {
          type: "object",
          properties: {
            a: { type: "string" },
            b: { type: "string" },
            c: { type: "string" },
          },
          required: ["a", "b", "c"],
        },
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
        `"Configuration validation failed: {\\"/\\": \\"must have required property 'b'\\"}"`,
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

    it("undefined values are ignored", async () => {
      const config = confconf({
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
            b: "config",
          }),
          staticConfig({
            b: undefined,
          }),
        ],
      });

      expect(await config.loadAndValidate()).toEqual({
        a: "hello",
        b: "config",
      });
    });
  });

  describe("type coercion", () => {
    describe("string to number", () => {
      type SchemaWithNumber = {
        a: number;
      };
      const schemaWithNumber: JSONSchemaType<SchemaWithNumber> = {
        type: "object",
        properties: {
          a: { type: "number" },
        },
        required: ["a"],
      };

      it("coerces an integer", async () => {
        const config = confconf<SchemaWithNumber>({
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
      type SchemaWithBoolean = {
        a: boolean;
      };
      const schemaWithBoolean: JSONSchemaType<SchemaWithBoolean> = {
        type: "object",
        properties: {
          a: { type: "boolean" },
        },
        required: ["a"],
      };

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
      const configLoader = confconf({
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
      const configLoader = confconf({
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

  describe("error cases", () => {
    const failProvider: ConfigProvider = {
      name: "fail",
      load: () => {
        throw new Error();
      },
    };

    it("doesn't fail if single provider loading fails", async () => {
      const config = confconf({
        schema: defaultSchema,
        providers: [
          staticConfig({
            a: "hello",
            b: "config",
          }),
          failProvider,
        ],
      });

      expect(await config.loadAndValidate()).toEqual({
        a: "hello",
        b: "config",
      });
    });

    it("throws validation error if validation fails", async () => {
      let error = null;

      try {
        await confconf<{ a: string }>({
          schema: {
            type: "object",
            properties: { a: { type: "string" } },
            required: ["a"],
          },
          providers: [],
        }).loadAndValidate();
      } catch (e) {
        error = e as ValidationError;
      }

      expect(isValidationError(error)).toBe(true);
      expect(error?.message).toMatchInlineSnapshot(
        `"Configuration validation failed: {\\"/\\": \\"must have required property 'a'\\"}"`,
      );
      expect(error?.validationErrors).toMatchInlineSnapshot(`
        Array [
          Object {
            "instancePath": "",
            "keyword": "required",
            "message": "must have required property 'a'",
            "params": Object {
              "missingProperty": "a",
            },
            "schemaPath": "#/required",
          },
        ]
      `);
    });
  });
});
