import { Codec, number, string } from "purify-ts";

import { staticConfig } from "../src";
import { purifyConfconf } from "./testUtils";

describe("Usage with purify-ts", () => {
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
