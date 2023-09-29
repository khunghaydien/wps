import isNil from 'lodash/isNil';
import sumBy from 'lodash/sumBy';
import uuid from 'uuid/v4';

import TaskColorUtil from '../../../commons/utils/TaskColorUtil';
import { pipe } from '@commons/utils/FnUtil';

import { AutoHoursAllocationDictSurplusTime } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import { Job } from '../time-tracking/Job';

export type DailySummaryTaskBarColor = {
  base: string;
  linked: string;
};

export type DailySummaryTask = {
  id: string;
  jobId: string;
  jobCode: string;
  jobName: string;
  hasJobType: boolean;
  isDirectCharged: boolean;
  workCategoryId: string | null | undefined;
  workCategoryName: string | null | undefined;
  workCategoryCode: string | null | undefined;
  color: DailySummaryTaskBarColor;
  isDirectInput: boolean;
  volume: number | null | undefined;
  ratio: number | null | undefined;
  taskTime: number | null | undefined;
  taskNote: string | null | undefined;
  eventTaskTime?: number;
  isEditLocked: boolean;
};

export const colorizeTask = (
  colorIndex: number,
  task: DailySummaryTask
): DailySummaryTask => ({
  ...task,
  color: TaskColorUtil.getNextColor(colorIndex),
});

export const colorizeTasks = (
  startColorIndex: number,
  nonColorizedTasks: DailySummaryTask[]
): DailySummaryTask[] =>
  nonColorizedTasks.map((task, i) => colorizeTask(startColorIndex + i, task));

export const create = (colorIndex: number, job: Job) =>
  colorizeTask(colorIndex, {
    id: uuid(),
    jobId: job.id,
    jobCode: job.code,
    jobName: job.name,
    hasJobType: job.hasJobType,
    isDirectCharged: job.isDirectCharged,
    workCategoryId: null,
    workCategoryName: null,
    workCategoryCode: null,
    color: { base: '', linked: '' },
    isDirectInput: true,
    volume: null,
    ratio: null,
    taskTime: 0,
    taskNote: '',
    isEditLocked: job.isEditLocked,
  });

export const hasWorkCategory = (task: DailySummaryTask) => {
  return task.hasJobType || !isNil(task.workCategoryId);
};

export const isPercentageFull = (tasks: DailySummaryTask[]) => {
  const total = tasks
    .filter((task) => !task.isDirectInput)
    .reduce((prev, task) => prev + (parseInt(task.ratio as any, 10) || 0), 0);

  return total === 100;
};

/**
 * Test whether task time of non direct inputs is available or not.
 * @param {DailySummaryTask[]} tasks - Task list
 * @param {number} realWorkTime - Working hours (minutes since 00:00)
 * @returns {boolean}
 */
export const isTaskTimeOfNonDirectInputsAvailable = (
  tasks: DailySummaryTask[],
  realWorkTime: number | null | undefined
): boolean => {
  return !isNil(realWorkTime) && isPercentageFull(tasks);
};

/**
 * Calculate task times of ratio input.
 * The fraction part is dropped, so there is a case that
 * the sum of task time of result does not match realWorkTime
 * @param {DailySummaryTask[]} tasks - Task list
 * @param {number} realWorkTime - Working hours (minutes since 00:00)
 * @returns {Array<DailySummaryTask>}
 */
export const calculateTaskTimesOfNonDirectInput = (
  tasks: DailySummaryTask[],
  realWorkTime: number
): DailySummaryTask[] => {
  const totalTaskTimeOfDirectInput = sumBy(
    tasks.filter((task) => task.isDirectInput),
    (task) => task.taskTime
  );
  const restOfTaskTime = realWorkTime - totalTaskTimeOfDirectInput;
  if (restOfTaskTime <= 0) {
    return tasks.map((original) => ({
      ...original,
      taskTime: original.isDirectInput ? original.taskTime : 0,
    }));
  } else {
    return tasks.map((original) => {
      const task = { ...original };
      if (!task.isDirectInput && !isNil(task.ratio)) {
        return {
          ...task,
          taskTime: Math.floor(restOfTaskTime * (task.ratio / 100)),
        };
      } else {
        return task;
      }
    });
  }
};

/**
 * Add the total time error between the actual working hours and the task
 * time to the task time of the target task.
 * @param {$ReadOnlyArray<DailySummaryTask>} tasks - Task list
 * @param {number} realWorkTime - Working hours (minutes since 00:00)
 * @param {DailySummaryTask} task - The task added error time
 * @returns {DailySummaryTask}
 */
export const addErrorOfTotalTaskTime = (
  tasks: ReadonlyArray<DailySummaryTask>,
  realWorkTime: number,
  task: DailySummaryTask
): DailySummaryTask => {
  const totalTaskTime = sumBy([...tasks], (task) => task.taskTime);
  const timeError = realWorkTime - totalTaskTime;
  if (timeError <= 0) {
    return { ...task };
  } else {
    return {
      ...task,
      taskTime: task.taskTime + timeError,
    };
  }
};

/**
 * Find the ratio input task which has the largest task time in tasks.
 * @param {DailySummaryTask} tasks
 * @returns {DailySummaryTask|null}
 */
export const findLargestRatioTask = (
  tasks: DailySummaryTask[]
): null | DailySummaryTask => {
  return tasks
    .filter((task) => !task.isDirectInput && !isNil(task.ratio))
    .reduce((prev, next) => {
      return !isNil(prev) && prev.ratio >= next.ratio ? prev : next;
    }, null);
};

export const sumRatio = (tasks: DailySummaryTask[]): number => {
  const total = tasks
    .filter((task) => !task.isDirectInput)
    .reduce((prev, task) => {
      // @ts-ignore parseInt takes only string
      return prev + (parseInt(task.ratio, 10) || 0);
    }, 0);
  return total;
};

export const makeRatioInputTaskTimeTo0 = (
  tasks: DailySummaryTask[]
): DailySummaryTask[] => {
  const updatedTasks = tasks.map((task) => {
    if (task.isDirectInput) {
      return task;
    }
    return {
      ...task,
      taskTime: 0,
    };
  });

  return updatedTasks;
};

export const containsTaskNoteThatCannotBeSaved = (
  task: DailySummaryTask
): boolean => {
  if (task.taskNote === '' || task.taskNote === undefined) {
    return false;
  }

  if (
    (task.isDirectInput && task.taskTime) ||
    (!task.isDirectInput && task.ratio)
  ) {
    return false;
  }

  return true;
};

export const applyAllocateResultToTaskList = (
  originalTaskList: DailySummaryTask[],
  allocatedResult: AutoHoursAllocationResult[],
  surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime,
  timeOfAttendance: number | null | undefined
) => {
  const updatedTaskList: DailySummaryTask[] = [...originalTaskList];
  const hasRateOrNot = updatedTaskList.some((task) => !task.isDirectInput);
  const updateIn = (
    task: DailySummaryTask,
    tasks: DailySummaryTask[]
  ): DailySummaryTask[] => {
    return tasks.map((t) => (t.id === task.id ? { ...t, ...task } : { ...t }));
  };

  // 割当結果の配列をループ処理する
  allocatedResult.forEach((result) => {
    // 既存タスク（同じジョブ・作業分類で直接入力のもの）を探す
    const existingTaskIndex = updatedTaskList.findIndex(
      (task) =>
        task.jobId === result.job?.id &&
        (task.workCategoryId || undefined) === result.workCategory?.id &&
        task.isDirectInput
    );

    if (existingTaskIndex >= 0) {
      // 既存タスクがあれば、それに作業時間を追加する
      const existingTask = updatedTaskList[existingTaskIndex];
      updatedTaskList[existingTaskIndex] = {
        ...existingTask,
        taskTime: existingTask.taskTime + result.taskTime,
      };
    } else {
      // 既存タスクがなければ、新たなタスクとして追加する
      updatedTaskList.push({
        id: uuid(), // 最近はnanoidを使っているが、ここでは従前のモデルの実装にあわせる
        isDirectInput: true, // 固定
        isEditLocked: false, // 割当結果には編集ロック済みのジョブは含まれない
        jobId: result.job?.id,
        jobCode: result.job?.code,
        jobName: result.job?.name,
        // @ts-ignore TODO: hasJobTypeがresult.jobの子要素になる想定
        hasJobType: result.job?.hasJobType,
        isDirectCharged: undefined,
        workCategoryId: result.workCategory?.id,
        workCategoryName: result.workCategory?.name,
        workCategoryCode: result.workCategory?.code,
        taskTime: result.taskTime,
        taskNote: '',
        volume: 0,
        ratio: 0,
        color: { base: '', linked: '' },
      });
    }
  });

  const totalDirectInputTime = sumBy(
    [...updatedTaskList].filter((task) => task.isDirectInput),
    (task) => task.taskTime
  );

  if (
    timeOfAttendance &&
    timeOfAttendance > totalDirectInputTime &&
    !hasRateOrNot
  ) {
    if (surplusTimeRegistrationSetting?.jobId) {
      const {
        jobId,
        jobCode,
        jobName,
        hasJobType,
        workCategoryId,
        workCategoryCode,
        workCategoryName,
      } = surplusTimeRegistrationSetting;
      updatedTaskList.push({
        id: uuid(),
        isDirectInput: false,
        isEditLocked: false,
        jobId,
        jobCode,
        jobName,
        // @ts-ignore TODO: hasJobTypeがresult.jobの子要素になる想定
        hasJobType,
        isDirectCharged: undefined,
        workCategoryId,
        workCategoryName,
        workCategoryCode,
        taskTime: timeOfAttendance - totalDirectInputTime,
        taskNote: '',
        volume: 0,
        ratio: 100,
        color: { base: '', linked: '' },
      });

      // NOTE: 余剰時間設定ジョブかつ実績時間00:00のタスクを取り除く
      // そのタスクは、以前の自動割当で取り込まれた余剰時間設定ジョブと考えられるが、
      // 今回追加するタスク（割合100％）と重複エラーになるため、取込反映時に取り除く
      const repetitiveTaskIndex = updatedTaskList.findIndex(
        (task) =>
          task.jobId === jobId &&
          task.workCategoryId === workCategoryId &&
          task.isDirectInput &&
          task.taskTime === 0
      );
      if (repetitiveTaskIndex >= 0) {
        updatedTaskList.splice(repetitiveTaskIndex, 1);
      }
    }
  }

  const reCalcupdatedTaskList = pipe(
    (taskList: DailySummaryTask[]) => {
      return calculateTaskTimesOfNonDirectInput(
        taskList,
        timeOfAttendance || 0
      );
    },
    (taskList) => {
      const ratioTask = findLargestRatioTask(taskList);
      if (ratioTask !== null) {
        const updatedTask = addErrorOfTotalTaskTime(
          taskList,
          timeOfAttendance || 0,
          { ...ratioTask }
        );
        return updateIn(updatedTask, taskList);
      } else {
        return taskList;
      }
    }
  )([...updatedTaskList]);

  return reCalcupdatedTaskList;
};
