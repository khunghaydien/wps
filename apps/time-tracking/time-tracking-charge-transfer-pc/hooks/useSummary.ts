import { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { State } from '../modules';
import { action } from '../modules/ui/timeTrackingCharge';

type Summary = {
  summaryId: string;
  summaryPeriod: {
    startDate: Date;
    endDate: Date;
  };
};
type SelectSummary = (summary: Summary) => void;

export const useSummary = (): [Summary, SelectSummary] => {
  const summaryId = useSelector(
    (state: State) => state.ui.timeTrackingCharge.summaryId,
    shallowEqual
  );
  const summaryPeriod = useSelector(
    (state: State) => state.ui.timeTrackingCharge.summaryPeriod,
    shallowEqual
  );

  const summary = useMemo(
    () => ({
      summaryId,
      summaryPeriod,
    }),
    [summaryId, summaryPeriod]
  );

  const dispatch = useDispatch();

  const selectDestinationTask = useCallback(
    (summary: Summary) => {
      dispatch(action.SELECT_SUMMARY(summary));
    },
    [dispatch]
  );

  return [summary, selectDestinationTask];
};
