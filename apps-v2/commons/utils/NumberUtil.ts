const isNull = (value?: number | string | null): boolean => {
  return value !== 0 && value !== '0' && !value;
};

/**
 * 数字の 0 なのか未入力なのかを判定して null か数値を返します。
 *
 * @param {*} value
 * @return number | null
 */
export const parseNumberOrNull = (
  value?: number | string | null
): number | null => {
  if (isNull(value) || isNaN(value as number)) {
    return null;
  }
  return Number(value);
};

/**
 * 数字の 0 なのか未入力なのかを判定して null か数値を返します。
 *
 * @param {*} value
 * @return number | null
 */
export const parseIntOrNull = (
  value: number | string | null,
  radix = 10
): number | null => {
  if (isNull(value)) {
    return null;
  }
  const v = parseInt(String(value), radix);
  if (isNaN(v)) {
    return null;
  }
  return v;
};

/**
 * 数字の 0 なのか未入力なのかを判定して '' か数値を返します。
 *
 * @param {*} value
 * @return number | ''
 */
export const parseNumberOrStringNull = (
  value?: number | string | null
): number | '' => {
  const v = parseNumberOrNull(value);
  if (v === null) {
    return '';
  }
  return v;
};

/**
 * 数字の 0 なのか未入力なのかを判定して '' か整数値を返します。
 *
 * @param {*} value
 * @param {number} radix
 * @return number | ''
 */
export const parseIntOrStringNull = (
  value: number | string | null,
  radix = 10
): number | '' => {
  const v = parseIntOrNull(value, radix);
  if (v === null) {
    return '';
  }
  return v;
};

/**
 * Convert number or string toFixed number
 *
 * @param {*} value
 * @param {number} decimalPlaces
 * @return number
 */
export const toFixedNumber = (
  value: number | string,
  decimalPlaces = 0
): number => {
  return Number(Number(value).toFixed(decimalPlaces));
};
