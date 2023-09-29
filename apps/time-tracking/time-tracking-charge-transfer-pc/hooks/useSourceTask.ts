import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { State } from '../modules';
import { action } from '../modules/ui/timeTrackingCharge';

type Task = State['ui']['timeTrackingCharge']['srcTask'];
type SourceTask = Task;
type SelectSourceTask = (task: Partial<Task>) => void;

export const useSourceTask = (): [SourceTask, SelectSourceTask] => {
  const sourceTask = useSelector(
    (state: State) => state.ui.timeTrackingCharge.srcTask,
    shallowEqual
  );

  const dispatch = useDispatch();

  const selectSourceTask = useCallback(
    (task: Partial<Task>) => {
      dispatch(action.SELECT_SRC_TASK(task));
    },
    [dispatch]
  );

  return [sourceTask, selectSourceTask];
};
