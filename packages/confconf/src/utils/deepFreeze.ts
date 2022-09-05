/**
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
export function deepFreeze<T>(object: T): T {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  for (const name of propNames) {
    const value = (object as any)[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}
