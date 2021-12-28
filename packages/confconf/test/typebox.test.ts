import { Type } from "@sinclair/typebox";

import { staticConfig } from "../src";
import { typeboxConfconf } from "./testUtils";

const schema = Type.Object({
  a: Type.String(),
  b: Type.Number(),
});

describe("Usage with typebox", () => {
  it("works with typebox", async () => {
    const configLoader = typeboxConfconf({
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

    // typescript checks
    config.a;
    config.b;
  });
});
