import { Type } from "@sinclair/typebox";

import { confconf, staticConfig } from "../src";

import type { Static } from "@sinclair/typebox";

const schema = Type.Object({
  a: Type.String(),
  b: Type.Number(),
});

type Config = Static<typeof schema>;

describe("Usage with typebox", () => {
  it("works with typebox", async () => {
    const configLoader = confconf<Config>({
      schema,
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
  });
});
