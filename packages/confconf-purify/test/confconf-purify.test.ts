import { Codec, array, boolean, number, string } from "purify-ts";

import { confconf, envConfig, devOnlyConfig, staticConfig } from "../src";

describe("confconf-purify", () => {
  it("works with purify-ts", async () => {
    const configLoader = confconf({
      schema: Codec.interface({
        a: string,
        b: number,
        c: Codec.interface({
          a: array(boolean),
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
      schema: Codec.interface({
        a: string,
        b: string,
        c: string,
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
