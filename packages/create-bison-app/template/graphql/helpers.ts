/* eslint-disable @typescript-eslint/ban-ts-comment */

/** Removes nullability from a type
 * @example foo: string | null | undefined => foo: string | undefined
 */
export const prismaArg = <T>(field: T | undefined | null): T | undefined => {
  if (field === undefined || field === null) {
    return undefined;
  }

  return field;
};

/** Recursively removes nullability from nested object values */
type ObjectWithoutNulls<T> = {
  [K in keyof T]: T[K] extends string | number | undefined | null
    ? Exclude<T[K], null>
    : ObjectWithoutNulls<Exclude<T[K], null>>;
};

/** Removes nullability from the values of an object
 * @example foo: {bar: string | null | undefined} => foo: {bar: string | undefined}
 */
export const prismaArgObject = <T extends Partial<Record<keyof T, T[keyof T]>> | undefined>(
  field: T | null
): ObjectWithoutNulls<T> => {
  const newObject: T | null = field;

  if (!newObject || !field) {
    // @ts-ignore
    return undefined;
  }

  Object.entries(field).forEach(([key, value]) => {
    if (typeof value === 'object') {
      // @ts-ignore
      newObject[key] = prismaArgObject(value);
    } else {
      // @ts-ignore
      newObject[key] = prismaArg(value);
    }
  });

  // @ts-ignore
  return newObject;
};
