import { Type } from "@sinclair/typebox";

import { confconf, envConfig, devOnlyConfig, staticConfig } from "../src";

describe("confconf-typebox", () => {
  it("works with typebox", async () => {
    const configLoader = confconf({
      schema: Type.Object({
        a: Type.String(),
        b: Type.Number(),
        c: Type.Object({
          a: Type.Array(Type.Boolean()),
        }),
      }),
      providers: [
        staticConfig({
          a: "hello",
          b: "10",
          c: {
            a: [true],
          },
        }),
      ],
    });

    const config = await configLoader.loadAndValidate();
    expect(config).toEqual({
      a: "hello",
      b: 10,
      c: {
        a: [true],
      },
    });

    // typescript checks
    config.a;
    config.b;
    config.c;
    config.c.a;
    config.c.a[0];
  });

  it("export all the same things as the core package", async () => {
    process.env.B = "b";
    process.env.NODE_ENV = "development";

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
        envConfig({
          structure: {
            b: "B",
          },
        }),
        devOnlyConfig({
          c: "c",
        }),
      ],
    });

    const config = await configLoader.loadAndValidate();

    expect(config).toEqual({
      a: "hello",
      b: "b",
      c: "c",
    });
  });
});
