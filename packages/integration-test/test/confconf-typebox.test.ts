import { confconf, staticConfig } from "@confconf/confconf-typebox";
import { Type } from "@sinclair/typebox";

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
});
