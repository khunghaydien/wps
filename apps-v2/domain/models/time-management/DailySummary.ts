import defaultTo from 'lodash/defaultTo';
import isNil from 'lodash/isNil';
import sumBy from 'lodash/sumBy';
import uuidV4 from 'uuid/v4';

import Api from '../../../commons/api';

import STATUS, { Status } from '../approval/request/Status';
import { colorizeTasks, DailySummaryTask } from './DailySummaryTask';

export type { DailySummaryTask };

export type DailySummaryEvent = {
  id: string;
  subject: string | null | undefined;
  startDateTime: string | null | undefined;
  endDateTime: string | null | undefined;
};

export type DailySummary = {
  targetDate: string;
  useTimeAutoWorkingHourAllocation: boolean;
  useWorkReportByJob: boolean;
  status: Status;
  note: string | null | undefined;
  output: string | null | undefined;
  realWorkTime: number | null | undefined;
  isTemporaryWorkTime: boolean | null | undefined;
  taskList: DailySummaryTask[];
};

export type DailySummaryParam = {
  empId?: string;
  targetDate: string;
  note?: string;
  output?: string;
  taskList: Array<{
    jobId: string;
    workCategoryId: string | null | undefined;
    isDirectInput: boolean;
    taskTime?: number;
    ratio?: number;
    volume?: number;
    taskNote?: string;
  }>;
};

export type EventFromRemote = {
  id: string;
  subject: string | null | undefined;
  startDateTime: string | null | undefined;
  endDateTime: string | null | undefined;
};

export type TaskFromRemote = {
  jobId: string;
  jobCode: string;
  jobName: string;
  hasJobType: boolean;
  isDirectCharged: boolean;
  workCategoryId: string | null | undefined;
  workCategoryCode: string | null | undefined;
  workCategoryName: string | null | undefined;
  isDirectInput: boolean;
  volume: number | null | undefined;
  ratio: number | null | undefined;
  taskTime: number | null | undefined;
  taskNote: string | null | undefined;
  eventList: DailySummaryEvent[];
  isEditLocked: boolean;
};

export type ContentsFromRemote = {
  targetDate: string;
  useTimeAutoWorkingHourAllocation: boolean;
  useWorkReportByJob: boolean;
  status:
    | 'NotRequested'
    | 'Pending'
    | 'Approved'
    | 'Rejected'
    | 'Removed'
    | 'Canceled';
  note: string | null | undefined;
  output: string | null | undefined;
  realWorkTime: number | null | undefined;
  isTemporaryWorkTime: boolean | null | undefined;
  taskList: TaskFromRemote[];
};

export const convertTaskFromRemote = (
  taskFromRemote: TaskFromRemote
): DailySummaryTask => ({
  // FIXME this makes a function mutable
  id: uuidV4(),
  jobId: taskFromRemote.jobId,
  jobCode: taskFromRemote.jobCode,
  jobName: taskFromRemote.jobName,
  hasJobType: taskFromRemote.hasJobType,
  isDirectCharged: taskFromRemote.isDirectCharged,
  workCategoryId: taskFromRemote.workCategoryId,
  workCategoryName: taskFromRemote.workCategoryName,
  workCategoryCode: taskFromRemote.workCategoryCode,
  color: { base: '', linked: '' },
  isDirectInput: taskFromRemote.isDirectInput,
  volume: taskFromRemote.volume,
  ratio: taskFromRemote.ratio,
  // complete task-hours by total duration of related events
  taskTime: taskFromRemote.taskTime,
  taskNote: taskFromRemote.taskNote || '',
  isEditLocked: taskFromRemote.isEditLocked,
});

const convertContentsFromRemote = (
  contentsFromRemote: ContentsFromRemote
): DailySummary => ({
  targetDate: contentsFromRemote.targetDate,
  useTimeAutoWorkingHourAllocation:
    contentsFromRemote.useTimeAutoWorkingHourAllocation,
  useWorkReportByJob: contentsFromRemote.useWorkReportByJob,
  status: contentsFromRemote.status,
  note: contentsFromRemote.note,
  output: contentsFromRemote.output,
  realWorkTime: contentsFromRemote.realWorkTime,
  isTemporaryWorkTime: contentsFromRemote.isTemporaryWorkTime,
  taskList: contentsFromRemote.taskList.map(convertTaskFromRemote),
});

export const fetchDailySummaryContents = (
  targetDate: string
): Promise<DailySummary> =>
  Api.invoke({
    path: '/daily-summary/get',
    param: {
      targetDate,
    },
  }).then((response) => convertContentsFromRemote(response));

export const calculateEachRatioOfNonDirectInputTasks = (
  taskList: DailySummaryTask[]
) => {
  const nonDirectInputTaskVolumeSum = sumBy(taskList, (task) =>
    !task.isDirectInput ? task.volume : 0
  );

  const newTaskList: DailySummaryTask[] = taskList.map((task) =>
    !task.isDirectInput && !isNil(task.volume)
      ? {
          ...task,

          /* assert(task.volume !== null) */
          ratio:
            nonDirectInputTaskVolumeSum > 0
              ? Math.floor((task.volume / nonDirectInputTaskVolumeSum) * 100)
              : 0,
        }
      : { ...task, ratio: null }
  );

  // handle round-off errors
  const firstNonDirectInputTask = newTaskList.find(
    (task) => !task.isDirectInput && !isNil(task.volume) && task.volume > 0
  );
  if (!isNil(firstNonDirectInputTask)) {
    firstNonDirectInputTask.ratio +=
      100 -
      sumBy(
        newTaskList.filter((task) => !task.isDirectInput),
        (task) => task.ratio
      );
  }

  return newTaskList;
};

export const calculateEachTaskTimeOfNonDirectInputTasks = (
  realWorkTime: number | null | undefined,
  taskList: DailySummaryTask[]
) => {
  const directInputTaskTimeSum = sumBy(
    taskList.filter((task) => task.isDirectInput),
    (task) => defaultTo(task.taskTime, 0)
  );

  /* assert(realWorkTime !== 0) */
  const nonDirectInputTaskTimeSum = Math.max(
    0,
    defaultTo(realWorkTime, 0) - directInputTaskTimeSum
  );

  const newTaskList: DailySummaryTask[] = taskList.map((task) =>
    !task.isDirectInput && !isNil(task.ratio)
      ? {
          ...task,
          taskTime:
            nonDirectInputTaskTimeSum > 0 &&
            !isNil(task.volume) &&
            task.volume > 0
              ? Math.floor((nonDirectInputTaskTimeSum * task.ratio) / 100)
              : null,
        }
      : task
  );

  const firstNonDirectInputTask = newTaskList.find(
    (task) => !task.isDirectInput && !isNil(task.taskTime)
  );
  if (!isNil(firstNonDirectInputTask)) {
    firstNonDirectInputTask.taskTime +=
      nonDirectInputTaskTimeSum -
      sumBy(
        newTaskList.filter((task) => !task.isDirectInput),
        (task) => defaultTo(task.taskTime, 0)
      );
  }

  return newTaskList;
};

/**
 * Given actual work hours in the day and tasks in Daily Summary on the date,
 * calculates each ratio and task-hours for non-direct-input tasks.
 * @param {?number} realWorkTime Actual work hours in the day. Cannot be null.
 * @param {Object[]} tasks Tasks in Daily Summary on the date. Can contain direct-input tasks.
 * @returns {Object[]} Given direct-input tasks, and non-direct-input tasks with ratio and volume calculated by actual work hours in the day.
 */
export const calculateEachRatioAndTaskTimeOfNonDirectInputTasks = (
  realWorkTime: number | null | undefined,
  taskList: DailySummaryTask[]
): DailySummaryTask[] => {
  return calculateEachTaskTimeOfNonDirectInputTasks(
    realWorkTime,
    calculateEachRatioOfNonDirectInputTasks(taskList)
  );
};

export const isLocked = (dailySummary: DailySummary): boolean => {
  const lockedStatus: string[] = [STATUS.Pending, STATUS.Approved];
  return lockedStatus.includes(dailySummary.status);
};

export const convertFromRemote = (remote: ContentsFromRemote): DailySummary => {
  const dailySummary = convertContentsFromRemote(remote);

  let taskList = dailySummary.taskList;

  // Set a color for each bar of tasks
  taskList = colorizeTasks(0, taskList);

  // this value is used on DailySummary's textarea value
  // so have to convert null to Empty in order to avoid make React.js update view properly.
  const note = dailySummary.note || '';

  return {
    ...dailySummary,
    taskList,
    note,
  };
};
