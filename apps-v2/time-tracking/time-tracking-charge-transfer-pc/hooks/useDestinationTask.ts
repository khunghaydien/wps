import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { State } from '../modules';
import { action } from '../modules/ui/timeTrackingCharge';

type Task = State['ui']['timeTrackingCharge']['destTask'];
type DestinationTask = Task;
type SelectDestinationTask = (task: Partial<Task>) => void;

export const useDestinationTask = (): [
  DestinationTask,
  SelectDestinationTask
] => {
  const destinationTask = useSelector(
    (state: State) => state.ui.timeTrackingCharge.destTask,
    shallowEqual
  );

  const dispatch = useDispatch();

  const selectDestinationTask = useCallback(
    (task: Partial<Task>) => {
      dispatch(action.SELECT_DEST_TASK(task));
    },
    [dispatch]
  );

  return [destinationTask, selectDestinationTask];
};
