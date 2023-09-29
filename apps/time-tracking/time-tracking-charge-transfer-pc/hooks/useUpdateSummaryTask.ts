import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { format } from 'date-fns';

import SummaryTask from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/SummaryTask';

import { useDate } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDate';
import { useDelegate } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDelegate';
import { useDestinationTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useDestinationTask';
import { useSourceTask } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSourceTask';
import { useSummary } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useSummary';

type UpdateSummaryTask = () => void;

export const useUpdateSummaryTask = (
  onSuccess: () => unknown
): UpdateSummaryTask => {
  const [startDate, endDate] = useDate();
  const [sourceTask] = useSourceTask();
  const [destinationTask] = useDestinationTask();
  const [summary] = useSummary();
  const [, user] = useDelegate();
  const dispatch = useDispatch();
  const summaryTask = useMemo(() => SummaryTask(dispatch), [dispatch]);

  const updateSummaryTask = useCallback(() => {
    const param = {
      empId: user?.isDelegated ? user.id : undefined,
      startDate: format(startDate, 'YYYY-MM-DD'),
      endDate: format(endDate, 'YYYY-MM-DD'),
      sourceJobId: sourceTask.jobId,
      sourceWorkCategoryId: sourceTask.workCategoryId || undefined,
      destinationJobId: destinationTask.jobId,
      destinationWorkCategoryId: destinationTask.workCategoryId || undefined,
      summaryId: summary.summaryId,
    };
    summaryTask.update(param, destinationTask, onSuccess);
  }, [
    user,
    startDate,
    endDate,
    sourceTask,
    destinationTask,
    summary,
    onSuccess,
    summaryTask,
  ]);

  return updateSummaryTask;
};
