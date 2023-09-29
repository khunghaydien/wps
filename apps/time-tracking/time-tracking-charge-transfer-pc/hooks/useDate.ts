import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '../modules';
import { action } from '../modules/ui/timeTrackingCharge';

type StartDate = Date;
type EndDate = Date;
type SelectStartDate = (date: Date) => void;
type SelectEndDate = (date: Date) => void;

export const useDate = (): [
  StartDate,
  EndDate,
  SelectStartDate,
  SelectEndDate
] => {
  const startDate = useSelector(
    (state: State) => state.ui.timeTrackingCharge.startDate
  );

  const endDate = useSelector(
    (state: State) => state.ui.timeTrackingCharge.endDate
  );

  const dispatch = useDispatch();

  const selectStartDate = useCallback(
    (date: Date) => {
      dispatch(action.SELECT_START_DATE(date));
    },
    [dispatch]
  );

  const selectEndDate = useCallback(
    (date: Date) => {
      dispatch(action.SELECT_END_DATE(date));
    },
    [dispatch]
  );

  return [startDate, endDate, selectStartDate, selectEndDate];
};
