import * as React from 'react';

import { DailySummaryTask } from '../../../domain/models/time-management/DailySummaryTask';

type R = [
  Array<{ current: null | HTMLInputElement }>,
  (arg0: number) => (arg0: React.KeyboardEvent<HTMLInputElement>) => void
];

export const useFocusSequentially = (length: number): R => {
  const refs = React.useMemo(
    () => [...Array(length)].map(() => React.createRef<HTMLInputElement>()),
    [length]
  );

  const onFocusNextElement = React.useCallback(
    (currentIndex) => (e) => {
      const { current } = refs[currentIndex];
      const nextElement = refs[currentIndex + 1];
      if (e.key === 'Enter') {
        if (nextElement && nextElement.current) {
          nextElement.current.focus();
        } else if (current) {
          current.blur();
        }
      }
    },
    [refs]
  );

  return [refs, onFocusNextElement];
};

export const useIsReadOnlyRatePicker = (tasks: DailySummaryTask[]) => {
  const ratioInputTasks = React.useMemo(
    () => tasks.filter((task) => !task.isDirectInput),
    [tasks]
  );

  const isReadOnlyRatePicker = React.useCallback(
    (i: number) => ratioInputTasks.length === 1 && !tasks[i].isDirectInput,
    [tasks, ratioInputTasks]
  );

  return isReadOnlyRatePicker;
};
