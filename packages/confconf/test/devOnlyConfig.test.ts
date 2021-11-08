import { devOnlyConfig } from "../src/devOnlyConfig";

describe("devOnlyConfig", () => {
  it("provides config when NODE_ENV is development", async () => {
    process.env.NODE_ENV = "development";
    const config = await devOnlyConfig({
      host: "localhost",
    }).load();

    expect(config).toEqual({
      host: "localhost",
    });
  });

  it("does not provide config when NODE_ENV is production", async () => {
    process.env.NODE_ENV = "production";
    const config = await devOnlyConfig({
      host: "localhost",
    }).load();

    expect(config).toEqual({});
  });
});
