import { useCallback } from 'react';

import parse from 'date-fns/parse';

import { useDate } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDate';
import { useSourceTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSourceTask';
import { useSummary } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSummary';

type SelectSourceTask = ReturnType<typeof useSourceTask>['1'];
type SelectTask = (targetSummary: {
  task: Parameters<SelectSourceTask>[number];
  period: {
    startDate: string;
    endDate: string;
  };
  summaryId: string;
}) => void;

export const useSelectTask = (): SelectTask => {
  const [, , selectStartDate, selectEndDate] = useDate();
  const [, selectSourceTask] = useSourceTask();
  const [, selectSummary] = useSummary();

  const selectTask = useCallback<SelectTask>(
    (targetSummary) => {
      const startDate = parse(targetSummary.period.startDate);
      const endDate = parse(targetSummary.period.endDate);
      selectSourceTask(targetSummary.task);
      selectStartDate(startDate);
      selectEndDate(endDate);
      selectSummary({
        summaryId: targetSummary.summaryId,
        summaryPeriod: {
          startDate,
          endDate,
        },
      });
    },
    [selectEndDate, selectStartDate, selectSummary, selectSourceTask]
  );

  return selectTask;
};
