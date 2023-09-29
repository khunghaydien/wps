import { cloneDeep, set } from 'lodash';

/**
 * Get updated formik values & touched using updateObj
 *
 * @param {Object} values formik values
 * @param {Object} touched formik touched object
 * @param {Object} updateObj new values used to update values and touched
 * @returns {Object} {values, touched}
 */

/* eslint-disable import/prefer-default-export */
export const updateValues = <
  T extends Record<string, any>,
  U extends Record<string, any>,
  O extends Record<string, any>
>(
  values: T,
  touched: U,
  updateObj: O
): { values: T; touched: U } => {
  const tmpValues = cloneDeep(values);
  const tmpTouched = cloneDeep(touched);

  Object.keys(updateObj).forEach((key) => {
    set(tmpValues, key, updateObj[key]);
    set(tmpTouched, key, true);
  });
  return { values: tmpValues, touched: tmpTouched };
};
