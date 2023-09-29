import React from 'react';
import { useSelector } from 'react-redux';

import { includesNonDirectInput } from '../../../../domain/models/time-tracking/Task';

import { State as dailyTaskState } from '../../../modules';

import DailyTaskHeader from '../../../components/organisms/tracking/DailyTaskHeader';

const useSumTimeOfTaskList = (): [number | null, number] => {
  const taskList = useSelector(
    (state: dailyTaskState) => state.tracking.entity.dailyTask.taskList
  );

  const timeOfAttendance = useSelector(
    (state: dailyTaskState) => state.tracking.entity.dailyTask.realWorkTime || 0
  );

  const directInputTasks = React.useMemo(() => {
    return taskList.filter((task) => task.isDirectInput);
  }, [taskList]);

  const nonDirectInputTasks = React.useMemo(() => {
    return taskList.filter((task) => !task.isDirectInput);
  }, [taskList]);

  const totalTime = React.useMemo(() => {
    return directInputTasks.reduce((prev, task) => {
      return prev + (parseInt(task.taskTime, 10) || 0);
    }, 0);
  }, [directInputTasks]);

  const totalRatio = React.useMemo(() => {
    return nonDirectInputTasks.reduce((prev, task) => {
      return prev + (parseInt(task.ratio, 10) || 0);
    }, 0);
  }, [nonDirectInputTasks]);

  if (nonDirectInputTasks.length && totalRatio !== 100) {
    return [null, totalRatio];
  }

  if (!nonDirectInputTasks.length || timeOfAttendance < totalTime) {
    return [totalTime, totalRatio];
  }

  return [timeOfAttendance, totalRatio];
};

const DailyTaskHeaderContainer = () => {
  const [timeOfTimeTracking, totalRatio] = useSumTimeOfTaskList();
  const timeOfAttendance = useSelector(
    (state: dailyTaskState) => state.tracking.entity.dailyTask.realWorkTime
  );
  const isTemporaryWorkTime = useSelector(
    (state: dailyTaskState) =>
      state.tracking.entity.dailyTask.isTemporaryWorkTime
  );
  const tasks = useSelector(
    (state: dailyTaskState) => state.tracking.entity.dailyTask.taskList
  );
  const includesNonDirectInputTask = React.useMemo(() => {
    return includesNonDirectInput(tasks);
  }, [tasks]);

  return (
    <DailyTaskHeader
      includesNonDirectInputTask={includesNonDirectInputTask}
      isTemporaryWorkTime={isTemporaryWorkTime}
      totalRatio={totalRatio}
      timeOfTimeTracking={timeOfTimeTracking}
      timeOfAttendance={timeOfAttendance}
    />
  );
};

export default DailyTaskHeaderContainer;
