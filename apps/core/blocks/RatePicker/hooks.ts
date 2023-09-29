import { useCallback, useEffect, useMemo, useState } from 'react';

import range from 'lodash/range';
import nanoid from 'nanoid';

export const useRateOptions = (
  minRate: number,
  maxRate: number,
  stepInRate: number
): ReadonlyArray<{ id: string; value: string; label: string }> => {
  const rates = useMemo(
    () => (minRate > maxRate ? [] : range(minRate, maxRate, stepInRate)),
    [stepInRate, minRate, maxRate]
  );

  return useMemo(
    () =>
      rates.map((rate) => ({
        id: nanoid(8),
        value: String(rate),
        label: String(rate),
      })),
    [rates]
  );
};

export const useInputState = (
  nextValue: string
): [string, (value: string) => void] => {
  const [value, setValue] = useState(nextValue);

  /*
   * Equivalent to componentReceiveProps
   */
  useEffect(() => {
    setValue(nextValue);
  }, [nextValue]);

  const onChange = useCallback(
    // eslint-disable-next-line no-shadow
    (value: string) => {
      setValue(value);
    },
    [setValue]
  );

  return [value, onChange];
};
