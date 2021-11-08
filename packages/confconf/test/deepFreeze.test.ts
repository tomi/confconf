import { deepFreeze } from "../src/utils/deepFreeze";

describe("deepFreeze", () => {
  const obj = {
    a: "hello",
    b: 10,
    c: {
      deep: {
        inner: {
          d: "value",
        },
      },
      asd: [1, 2],
    },
  };

  it("returns the same object back", () => {
    expect(deepFreeze(obj)).toEqual(obj);
  });

  it("freezes the object first level", () => {
    const frozen = deepFreeze<typeof obj>(obj);

    expect(() => (frozen.a = "throws")).toThrow();
  });

  it("freezes nested object", () => {
    const frozen = deepFreeze<typeof obj>(obj);

    expect(() => (frozen.c.deep.inner.d = "throws")).toThrow();
  });
});
