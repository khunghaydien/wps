import { useMemo } from 'react';

import range from 'lodash/range';
import nanoid from 'nanoid';

import TimeUtil from '../../../commons/utils/TimeUtil';

// eslint-disable-next-line import/prefer-default-export
export const useMinuteOptions = (
  minMinutes: number,
  maxMinutes: number,
  stepInMinutes: number
): ReadonlyArray<{ id: string; value: string; label: string }> => {
  const times = useMemo(
    () =>
      minMinutes > maxMinutes
        ? []
        : range(minMinutes, maxMinutes, stepInMinutes),
    [stepInMinutes, minMinutes, maxMinutes]
  );

  return useMemo(
    () =>
      times.map((time) => ({
        id: nanoid(8),
        value: TimeUtil.toHHmm(time),
        label: TimeUtil.toHHmm(time),
      })),
    [times]
  );
};
