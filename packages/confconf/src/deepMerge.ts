/**
 * From: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 */

/**
 * Simple object check.
 */
export function isObject(item: unknown) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 */
export function mergeDeep<T>(target: any, ...sources: any[]): T {
  if (sources.length === 0) return target as T;
  const source = sources[0];

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources.slice(1));
}
