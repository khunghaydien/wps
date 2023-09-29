import { useMemo } from 'react';

import format from 'date-fns/format';
import max from 'date-fns/max';
import min from 'date-fns/min';
import parse from 'date-fns/parse';

import { useDate } from './useDate';
import { useDestinationTask } from './useDestinationTask';

type StartDate = string;
type EndDate = string;

export const useWorkCategoryPeriod = (): [StartDate, EndDate] => {
  const [startDateForTransfer, endDateForTransfer] = useDate();
  const [task] = useDestinationTask();

  const { startDate, endDate } = useMemo(() => {
    const validFrom = parse(task.validFrom);
    const validTo = parse(task.validTo);
    return {
      startDate: format(max(startDateForTransfer, validFrom), 'YYYY-MM-DD'),
      endDate: format(min(endDateForTransfer, validTo), 'YYYY-MM-DD'),
    };
  }, [startDateForTransfer, endDateForTransfer, task.validFrom, task.validTo]);

  return [startDate, endDate];
};
