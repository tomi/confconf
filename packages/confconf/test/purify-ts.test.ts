import { Codec, number, string } from "purify-ts";

import { confconf, staticConfig } from "../src";

import type { GetType } from "purify-ts";

const codec = Codec.interface({
  a: string,
  b: number,
});

const schema = codec.schema();

type Config = GetType<typeof codec>;

describe("Usage with purify-ts", () => {
  it("works with purify-ts", async () => {
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
