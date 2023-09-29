import defaultTo from 'lodash/defaultTo';
import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import minBy from 'lodash/fp/minBy';
import orderBy from 'lodash/fp/orderBy';
import sumBy from 'lodash/fp/sumBy';
import isNil from 'lodash/isNil';
import keyBy from 'lodash/keyBy';
import range from 'lodash/range';

import { pipe } from '@commons/utils/FnUtil';

export type TaskFromRemote = {
  jobId: string;
  jobCode: string;
  jobName: string;
  workCategoryId: string | null | undefined;
  workCategoryCode: string | null | undefined;
  workCategoryName: string | null | undefined;
  ratio: number | null | undefined;
  taskTime: number | null | undefined;
  taskNote: string | null | undefined;
  order: number;
  isDirectInput: boolean;
  hasJobType: boolean;

  /**
   * Actual performance or the other performances.
   * true: actual performance
   * false: the other performances
   */
  isRecorded: boolean;
};

/**
 * Actual performance for a job and a work category or
 * last performance automatically entered or
 * performance for events
 */
export type Task = TaskFromRemote & {
  id: string;
  graphRatio: number;
  volume?: number;
  eventTaskTime: number;
  color: Partial<{
    base: string;
    linked: string;
  }>;
};

export type TaskForMonthlyReportFromRemote = {
  jobId: string;
  jobCode: string;
  jobName: string;
  workCategoryId: string | null | undefined;
  workCategoryCode: string | null | undefined;
  workCategoryName: string | null | undefined;
  ratio: number | null | undefined;
  taskTime: number | null | undefined;
  taskNote: string | null | undefined;
  order: number;
};

export type TaskForMonthlyReport = TaskForMonthlyReportFromRemote & {
  id: string;
  graphRatio: number;
};

export type TaskForMonthlyReportSummary = {
  id: string;
  taskTimeSum: number;
  jobId: string;
  jobName: string;
  workCategoryId: string | null | undefined;
  workCategoryName: string | null | undefined;
  barColor: string;
  graphRatio: number;
};

const updateIn = <T extends { id: string }>(
  items: T[],
  item: T,
  identifier?: (arg0: T, arg1: T) => boolean
): T[] => {
  const identify = identifier || ((x, y) => x.id === y.id);
  return items.map((x) => (identify(x, item) ? { ...x, ...item } : x));
};

const mapWithOrder = <T extends { id: string }>(
  items: T[],
  orderSelector: (arg0: T) => number,
  mapSelector: (arg0: T) => T
): T[] => {
  keyBy(
    items.map((item, index) => ({
      id: item.id,
      order: index,
    })),
    (task) => task.id
  );
  const orderTable = keyBy(
    items.map((item, index) => ({
      id: item.id,
      order: index,
    })),
    (task) => task.id
  );
  const orderByTable = (item) => orderTable[item.id].order;
  return flow(
    orderBy([orderSelector, orderByTable], ['desc', 'asc']),
    map(mapSelector),
    orderBy([orderByTable], ['asc'])
  )(items);
};

const fillInGapOfTaskTime =
  (realWorkTime: number, modifiedTask?: Task) =>
  (taskList: Task[]): Task[] => {
    const task = flow(
      filter<Task>(
        (t) =>
          !t.isDirectInput &&
          defaultTo(t.ratio, 0) > 0 &&
          (isNil(modifiedTask) || t.id !== modifiedTask.id)
      ),
      minBy((t) => t.taskTime)
    )(taskList);
    if (task === undefined || Number(task.taskTime) <= 0) {
      return taskList;
    }

    const totalTaskTime = sumBy((t) => t.taskTime, taskList);
    const gapOfTaskTime = realWorkTime - totalTaskTime;
    return updateIn(taskList, {
      ...task,
      taskTime: defaultTo(task.taskTime, 0) + gapOfTaskTime,
    });
  };

const fillInGapOfRatio =
  (modifiedTask?: Task) =>
  (taskList: Task[]): Task[] => {
    const totalRatio = flow(
      filter<Task>((task) => !task.isDirectInput),
      sumBy((task) => task.ratio)
    )(taskList);
    let restOfRatio = 100 - totalRatio;
    const getRestOfRatio = (): number => {
      restOfRatio -= 1;
      return restOfRatio > -1 ? 1 : 0;
    };

    return mapWithOrder(
      taskList,
      (task) => defaultTo(task.ratio, 0),
      (task) => {
        if (
          !task.isDirectInput &&
          defaultTo(task.ratio, 0) > 0 &&
          (isNil(modifiedTask) || task.id !== modifiedTask.id)
        ) {
          return {
            ...task,
            ratio: task.ratio + getRestOfRatio(),
          };
        } else {
          return task;
        }
      }
    );
  };
// @ts-ignore
const getRatioCalculator = (modifiedTask?: Task, taskList: Task[]) => {
  const totalRatio = flow(
    filter<Task>((task) => !task.isDirectInput),
    sumBy((task) => defaultTo(task.ratio, 0))
  )(taskList);
  const diffRatio = 100 - totalRatio;
  const length = modifiedTask
    ? flow(
        filter<Task>((task) => modifiedTask && task.id !== modifiedTask.id),
        filter((task) => !task.isDirectInput)
      )(taskList).length
    : taskList.filter((task) => !task.isDirectInput).length;
  const values = flow(
    map<number, number>((x) => Math.floor((diffRatio + x) / length)),
    orderBy<number>([(x) => x], ['desc'])
  )(range(length)) as any as number[];

  return (task: Task): number => {
    const ratio = defaultTo(task.ratio, 0);

    if (values.length < 0) {
      return ratio;
    }

    const value = values.shift();
    return ratio + value;
  };
};

const balanceRatio =
  (modifiedTask?: Task) =>
  (taskList: Task[]): Task[] => {
    const calculateRatio = getRatioCalculator(modifiedTask, taskList);

    const doesExcludeModifiedTaskIfExists = modifiedTask
      ? (task) => modifiedTask && task.id !== modifiedTask.id
      : (_task) => true;

    return mapWithOrder(
      taskList,
      (task) => defaultTo(task.ratio, 0),
      (task) => {
        if (!task.isDirectInput && doesExcludeModifiedTaskIfExists(task)) {
          return {
            ...task,
            ratio: calculateRatio(task),
          };
        } else {
          return task;
        }
      }
    );
  };

const updateRatio = (taskList: Task[]) => {
  const nonDirectInputTotalTaskTime = flow(
    filter<Task>((task) => !task.isDirectInput),
    sumBy((task) => defaultTo(task.taskTime, 0))
  )(taskList);

  return taskList.map((task) => {
    return !task.isDirectInput
      ? {
          ...task,
          ratio:
            nonDirectInputTotalTaskTime === 0
              ? 0
              : Math.floor(
                  (defaultTo(task.taskTime, 0) / nonDirectInputTotalTaskTime) *
                    100
                ),
        }
      : task;
  });
};

export const calculateTaskTimeFromRatio =
  (realWorkTime: number) =>
  (taskList: Task[]): Task[] => {
    const directInputTotalTaskTime = flow(
      filter<Task>((task) => task.isDirectInput),
      sumBy((task) => defaultTo(task.taskTime, 0))
    )(taskList);
    const restTaskTime = realWorkTime - defaultTo(directInputTotalTaskTime, 0);

    return taskList.map((task) => {
      return !task.isDirectInput
        ? {
            ...task,
            taskTime:
              task.ratio === 0
                ? 0
                : Math.max(
                    0,
                    // @ts-ignore
                    Math.floor(restTaskTime * (defaultTo(task.ratio) / 100))
                  ),
          }
        : task;
    });
  };

export const updateInTaskList = (taskList: Task[], task: Task): Task[] => {
  return updateIn(taskList, {
    ...task,
    ratio: defaultTo(task.ratio, 0),
    taskTime: defaultTo(task.taskTime, 0),
  });
};

export const toggleDirectInput = (
  realWorkTime: number,
  modifiedTask: Task,
  taskList: Task[]
): Task[] => {
  return pipe(
    (ts: Task[]) =>
      updateInTaskList(ts, {
        ...modifiedTask,
        isDirectInput: !modifiedTask.isDirectInput,
      }),
    updateRatio,
    balanceRatio(),
    defaultTo(modifiedTask.taskTime, 0) !== 0 // taskTimeが0なら再計算してtaskTimeを求める必要がある
      ? calculateTaskTimeFromRatio(realWorkTime)
      : (xs) => xs,
    fillInGapOfRatio(modifiedTask),
    fillInGapOfTaskTime(realWorkTime, modifiedTask)
  )(taskList);
};

export const updateTaskList = (
  realWorkTime: number,
  modifiedTask: Task,
  taskList: Task[]
): Task[] => {
  const update = pipe(
    (ts: Task[]) => updateInTaskList(ts, modifiedTask),
    balanceRatio(modifiedTask),
    calculateTaskTimeFromRatio(realWorkTime),
    fillInGapOfRatio(modifiedTask),
    fillInGapOfTaskTime(realWorkTime, modifiedTask),
    /**
     * 割合を更新すると、マイナスのratioと時間のデータが出来るので、
     * 再度割合を再計算してあげる必要がある
     */
    updateRatio,
    balanceRatio(modifiedTask)
  );
  return update(taskList);
};

export const deleteTaskInTaskList = (
  realWorkTime: number,
  taskId: string,
  taskList: Task[]
): Task[] => {
  const newTaskList = taskList.filter((t) => t.id !== taskId);
  const recalculateTaskTime = pipe(
    balanceRatio(),
    calculateTaskTimeFromRatio(realWorkTime),
    fillInGapOfRatio(),
    fillInGapOfTaskTime(realWorkTime)
  );
  return recalculateTaskTime(newTaskList);
};

/**
 * Test whether the job of a given task has work category or not.
 * @param task
 * @returns {boolean}
 */
export const hasWorkCategory = (task: Task): boolean => {
  return task.hasJobType || !isNil(task.workCategoryId);
};

/**
 * Test whether to include direct input task.
 * @param task
 * @returns {boolean}
 */
export const includesNonDirectInput = <T extends { isDirectInput: boolean }>(
  tasks: T[]
): boolean => {
  return tasks.some((task) => !task.isDirectInput);
};

/**
 * Calculate the total percentage of the task list.
 * @param tasks
 * @returns {Task[]}
 */
export const calculateTotalRatio = (tasks: Task[]): number => {
  return tasks
    .filter((task) => !task.isDirectInput)
    .reduce((prev, task) => {
      return prev + (parseInt(task.ratio as any, 10) || 0);
    }, 0);
};

const defaultTask: Task = {
  id: '',
  graphRatio: 0,
  jobId: '',
  jobCode: '',
  jobName: '',
  workCategoryId: null,
  workCategoryCode: null,
  workCategoryName: null,
  ratio: 0,
  taskTime: 0,
  taskNote: null,
  order: -1,
  isDirectInput: false,
  isRecorded: true,
  hasJobType: false,
  color: {},
  eventTaskTime: 0,
};

export default defaultTask;
