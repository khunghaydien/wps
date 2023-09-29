import { useMemo } from 'react';

import { isBefore, parse } from 'date-fns';

import { STATUS, Status } from '@apps/attendance/domain/models/FixDailyRequest';

export const UIType = {
  APPROVED: 'approved',
  PENDING: 'pending',
  WARNING: 'warning',
  NOT_REQUESTED: 'not_requested',
  NONE: 'none',
} as const;

type UIType = typeof UIType[keyof typeof UIType];
type Result = {
  type: UIType;
};
type Params = {
  startTime?: string;
  endTime?: string;
  date: string;
  today?: Date;
  status: Status;
};

export function useFixDailyRequestUIType({
  date,
  status,
  today = new Date(),
  endTime,
  startTime,
}: Params): Result {
  const result = useMemo(() => {
    if (
      (startTime !== null && startTime !== '') ||
      (endTime !== null && endTime !== '')
    ) {
      switch (status) {
        case STATUS.APPROVED:
          return {
            type: UIType.APPROVED,
          };

        case STATUS.PENDING:
          return {
            type: UIType.PENDING,
          };
        case STATUS.RECALLED:
        case STATUS.REJECTED:
        case STATUS.CANCELED:
          return {
            type: UIType.WARNING,
          };
        case STATUS.NOT_REQUESTED:
          if (
            isBefore(parse(date), today) &&
            startTime != null &&
            startTime !== ''
          ) {
            return {
              type: UIType.NOT_REQUESTED,
            };
          } else {
            return {
              type: UIType.NONE,
            };
          }
      }
    } else if (status === STATUS.APPROVED || status === STATUS.PENDING) {
      return {
        type: UIType.WARNING,
      };
    }

    return {
      type: UIType.NONE,
    };
  }, [date, startTime, endTime, today, status]);

  return result;
}
