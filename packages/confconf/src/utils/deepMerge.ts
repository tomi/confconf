/**
 * From: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 */
import type { Debugger } from "debug";
/**
 * Simple object check.
 */
export function isObject(item: unknown) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 */
export function mergeDeep<T>(logger: Debugger | undefined, target: any, ...sources: any[]): T {
  if (sources.length === 0) return target as T;
  const source = sources[0];

  if (logger) {
    logger("merging %O into %O", source, target);
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        // don't log inner object merges
        mergeDeep(undefined, target[key], source[key]);
      } else if (source[key] !== undefined) {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  if (logger) {
    logger("merge end result is %O", target);
  }

  return mergeDeep(logger, target, ...sources.slice(1));
}
