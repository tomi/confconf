import { confconf, envConfig, staticConfig } from "@confconf/confconf";

describe("Integration tests", () => {
  it("loads static config", async () => {
    const configLoader = confconf<{
      a: string;
      b: number;
    }>({
      schema: {
        type: "object",
        properties: {
          a: { type: "string" },
          b: { type: "number" },
        },
      },
      providers: [
        staticConfig({
          a: "hello",
          b: 10,
        }),
      ],
    });

    const config = await configLoader.loadAndValidate();
    expect(config).toEqual({
      a: "hello",
      b: 10,
    });
  });

  it("loads env config", async () => {
    process.env = {
      VAR_A: "hello",
      VAR_B: "10",
    };

    const configLoader = confconf<{
      a: string;
      b: number;
    }>({
      schema: {
        type: "object",
        properties: {
          a: { type: "string" },
          b: { type: "number" },
        },
      },
      providers: [
        envConfig({
          structure: {
            a: "VAR_A",
            b: "VAR_B",
          },
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
