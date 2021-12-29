import { mergeDeep } from "../src/utils/deepMerge";

describe("mergeDeep", () => {
  it("merges two objects", () => {
    expect(
      mergeDeep(
        undefined,
        {},
        {
          a: 1,
          b: { c: 2 },
        },
        { b: { c: 3 } },
      ),
    ).toEqual({
      a: 1,
      b: {
        c: 3,
      },
    });
  });

  it("skips undefined values", () => {
    expect(
      mergeDeep(
        undefined,
        {},
        {
          a: 1,
          b: { c: 2 },
        },
        { b: { c: undefined } },
      ),
    ).toEqual({
      a: 1,
      b: {
        c: 2,
      },
    });
  });
});
