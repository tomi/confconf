import { envConfig } from "../src";

describe("envConfig", () => {
  it("loads config with default options", async () => {
    process.env = {
      VAR1: "a",
      VAR2: "b",
    };

    const provider = envConfig();

    expect(await provider.load()).toEqual({
      VAR1: "a",
      VAR2: "b",
    });
  });

  it("loads new config if it has changed", async () => {
    process.env = {
      VAR1: "a",
    };

    const provider = envConfig();

    expect(await provider.load()).toEqual({
      VAR1: "a",
    });

    process.env = {
      VAR1: "a",
      VAR2: "b",
    };

    expect(await provider.load()).toEqual({
      VAR1: "a",
      VAR2: "b",
    });
  });

  it("loads only env variables with given prefix", async () => {
    process.env = {
      VAR1: "a",
      VAR2: "b",
      PRE_VAR1: "c",
      PRE_VAR2: "d",
      PREVAR: "e",
    };

    const provider = envConfig({
      prefix: "PRE_",
    });

    expect(await provider.load()).toEqual({
      PRE_VAR1: "c",
      PRE_VAR2: "d",
    });
  });

  it("maps env variables into given structure", async () => {
    process.env = {
      VAR1: "a",
      VAR2: "b",
      PRE_VAR1: "c",
      PRE_VAR2: "d",
      PREVAR: "e",
    };

    const provider = envConfig({
      structure: {
        db: {
          conn: "VAR1",
          name: "VAR2",
        },
        block: "PREVAR",
      },
    });

    expect(await provider.load()).toEqual({
      db: {
        conn: "a",
        name: "b",
      },
      block: "e",
    });
  });
});
