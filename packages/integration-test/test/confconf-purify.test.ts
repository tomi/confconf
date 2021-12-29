import { confconf, staticConfig } from "@confconf/confconf-purify";
import { Codec, string, number, array, boolean } from "purify-ts/Codec";

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
});
