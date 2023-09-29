import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TaskInputMode } from '../constants/TASK_INPUT_MODE';

import { isTaskTimeOfNonDirectInputsAvailable } from '../../domain/models/time-management/DailySummaryTask';
import { WorkCategory } from '../../domain/models/time-tracking/WorkCategory';

import { State } from '../modules';
import { actions } from '../modules/ui/dailySummary';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as DailySummaryActions from '../action-dispatchers/DailySummary';

import { useSort } from '../components/hooks/useSort';
import TaskCard from '../components/TaskCard';

import { useACL } from './hooks/useACL';

/**
 * totalTaskTime 画面に表示される工数実績時間
 *  * 割合入力が1つも無い場合 → 直接入力の合計
 *  * 割合入力が含まれるが、割合の合計が100%でない場合 → null（「-」が表示）
 *  * 割合入力が含まれ、直接入力の合計が労働時間を超える場合 → 直接入力の合計
 *  * 割合入力が含まれ、直接入力の合計が労働時間を超えない場合 → 労働時間
 * TODO: ドメインロジックに移動する
 */
const useSumTimeOfTaskList = (): [
  totalTaskTime: number | null,
  totalRatio: number
] => {
  const { taskList, timeOfAttendance } = useSelector((state: State) => ({
    taskList: state.ui.dailySummary.taskList,
    timeOfAttendance: state.ui.dailySummary.realWorkTime || 0,
  }));

  const [directInputTasks, nonDirectInputTasks] = React.useMemo(
    () => [
      taskList.filter((task) => task.isDirectInput),
      taskList.filter((task) => !task.isDirectInput),
    ],
    [taskList]
  );

  const totalDirectInputtedTime = React.useMemo(() => {
    return directInputTasks.reduce((prev, task) => {
      // @ts-ignore parseInt takes only string
      return prev + (parseInt(task.taskTime, 10) || 0);
    }, 0);
  }, [directInputTasks]);

  const totalRatio = React.useMemo(() => {
    return nonDirectInputTasks.reduce((prev, task) => {
      // @ts-ignore parseInt takes only string
      return prev + (parseInt(task.ratio, 10) || 0);
    }, 0);
  }, [nonDirectInputTasks]);

  if (nonDirectInputTasks.length && totalRatio !== 100) {
    return [null, totalRatio];
  }

  if (
    !nonDirectInputTasks.length ||
    timeOfAttendance < totalDirectInputtedTime
  ) {
    return [totalDirectInputtedTime, totalRatio];
  }

  return [timeOfAttendance, totalRatio];
};

const mapStateToProps = (state: State) => ({
  targetDate: state.ui.dailySummary.targetDate,
  useWorkReportByJob: state.ui.dailySummary.useWorkReportByJob,
  taskInputMode: state.ui.dailySummary.taskInputMode,
  tasks: state.ui.dailySummary.taskList,
  isTemporaryWorkTime: state.ui.dailySummary.isTemporaryWorkTime,
  timeOfAttendance: state.ui.dailySummary.realWorkTime,
});

const TaskCardContainer: React.FC = () => {
  // Values

  const {
    targetDate,
    useWorkReportByJob,
    taskInputMode,
    tasks,
    timeOfAttendance,
    isTemporaryWorkTime,
  } = useSelector(mapStateToProps);

  const { editTimeTrack } = useACL();
  const [timeOfTimeTracking, totalRatio] = useSumTimeOfTaskList();

  const containsNonDirectInputTask = React.useMemo(() => {
    return tasks.some((task) => !task.isDirectInput);
  }, [tasks]);

  const isTaskTimeOfRatioInputsAvailable = React.useMemo(() => {
    return isTaskTimeOfNonDirectInputsAvailable(tasks, timeOfAttendance);
  }, [tasks, timeOfAttendance]);

  // Handlers

  const dispatch: AppDispatch = useDispatch();

  const { sortKey, order, sort, unsort } = useSort();

  const switchTaskInputMode = React.useCallback(
    (mode: TaskInputMode) => dispatch(actions.switchTaskInputMode(mode)),
    [dispatch]
  );

  const unsortIfSorted = React.useCallback(
    (key: typeof sortKey) => {
      if (sortKey === key) {
        unsort();
      }
    },
    [unsort, sortKey]
  );

  const editTaskTime = React.useCallback(
    (index: number, value: string | number, minutes?: number) => {
      unsortIfSorted('taskTime');

      const { isDirectInput } = tasks[index];
      const targetProp = isDirectInput ? 'taskTime' : 'ratio';
      const targetValue = isDirectInput ? minutes : value;
      dispatch(DailySummaryActions.editTask(index, targetProp, targetValue));
    },
    [dispatch, tasks, unsortIfSorted]
  );

  const editTaskWorkReport = React.useCallback(
    (index: number, value: string) => {
      dispatch(DailySummaryActions.editTask(index, 'taskNote', value));
    },
    [dispatch]
  );

  const toggleDirectInput = React.useCallback(
    (index: number) => {
      unsortIfSorted('taskTime');

      dispatch(DailySummaryActions.toggleTask(index));
    },
    [dispatch, unsortIfSorted]
  );

  const editTaskWorkCategory = React.useCallback(
    (index: number, { id, name, code }: WorkCategory) => {
      unsortIfSorted('workCategoryCode');

      dispatch(DailySummaryActions.editTask(index, 'workCategoryId', id));
      dispatch(DailySummaryActions.editTask(index, 'workCategoryName', name));
      dispatch(DailySummaryActions.editTask(index, 'workCategoryCode', code));
    },
    [dispatch, unsortIfSorted]
  );

  const deleteTask = React.useCallback(
    (index: number) => {
      dispatch(DailySummaryActions.deleteTask(index));
    },
    [dispatch]
  );

  const onDragEnd = React.useCallback(
    (tasks: State['ui']['dailySummary']['taskList']) => {
      unsort();

      dispatch(actions.update('taskList', tasks));
    },
    [dispatch, unsort]
  );

  // Effects

  React.useEffect(() => {
    if (sortKey) {
      dispatch(actions.sort(sortKey, order));
    }
  }, [dispatch, sortKey, order]);

  React.useEffect(unsort, [targetDate]);

  return (
    <TaskCard
      useWorkReportByJob={useWorkReportByJob}
      containsNonDirectInputTask={containsNonDirectInputTask}
      readOnly={!editTimeTrack}
      isTaskTimeOfRatioInputsAvailable={isTaskTimeOfRatioInputsAvailable}
      isTemporaryWorkTime={isTemporaryWorkTime}
      taskInputMode={taskInputMode}
      tasks={tasks}
      timeOfAttendance={timeOfAttendance}
      timeOfTimeTracking={timeOfTimeTracking}
      totalRatio={totalRatio}
      switchTaskInputMode={switchTaskInputMode}
      editTaskTime={editTaskTime}
      editTaskWorkCategory={editTaskWorkCategory}
      editTaskWorkReport={editTaskWorkReport}
      toggleDirectInput={toggleDirectInput}
      deleteTask={deleteTask}
      onDragEnd={onDragEnd}
      sortKey={sortKey}
      order={order}
      sort={sort}
      unsort={unsort}
    />
  );
};

export default TaskCardContainer;
