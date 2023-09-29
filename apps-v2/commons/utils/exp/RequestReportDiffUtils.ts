import { get, isEmpty, isNil } from 'lodash';

export type DifferenceValues = {
  [key: string]: { original: string; final: string };
};

/**
 * Function evaluates object 1 and object 2 to find dissimilar values based on the keys mentioned
 *
 * @param mapping The Required fields to check for difference
 * @param finalObj Object 1
 * @param originalObj Object 2
 * @returns Map containing original and final values if difference exists
 */
export const convertDifferenceValues = (
  mapping: Record<string, string>,
  finalObj: Record<string, any>,
  originalObj: Record<string, any>
): DifferenceValues => {
  const keys = Object.keys(mapping);
  const result: DifferenceValues = {};
  keys.forEach((key) => {
    const final = get(finalObj, key);
    const original = get(originalObj, mapping[key]);
    const isFinalNil = isNil(final);
    const isOriginalNil = isNil(original);
    if (!(isFinalNil && isOriginalNil) && original !== final) {
      const o = isOriginalNil ? '' : original;
      const f = isFinalNil ? '' : final;
      result[key] = { original: o, final: f };
    }
  });
  return result;
};

/**
 *
 * @param key search param
 * @param diffValues map containing the calculated diff
 * @returns boolean whether it contains the diff
 */
export const isDifferent = (
  key: string,
  diffValues: DifferenceValues
): boolean => {
  if (isEmpty(diffValues)) return false;
  const diff = diffValues[key];
  if (isEmpty(diff)) return false;
  return true;
};

export const convertNullOrUndefined = (str?: string): string => {
  if (!str || isNil(str) || str === 'null') return '';
  return str;
};
