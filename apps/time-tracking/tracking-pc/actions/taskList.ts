import * as constants from '../constants';

import TaskColorUtil from '../../../commons/utils/TaskColorUtil';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';
import {
  TaskForMonthlyReport,
  TaskForMonthlyReportSummary,
} from '@apps/domain/models/time-tracking/Task';

import TaskUtil from '../utils/TaskUtil';

type TaskForSummaryInConverting = Omit<
  TaskForMonthlyReportSummary,
  'barColor' | 'graphRatio'
>;
type TaskList = Record<string, TaskForMonthlyReportSummary>;
type TaskListInConverting =
  | TaskList
  | Record<string, TaskForSummaryInConverting>;

// グラフ色計算用カウンター
// 表示対象月度が変更されるたびにリセット
// 工数入力でタスクを追加した場合はリセットしないこと
let colorCount = 0;

// - private
const createTaskForSummary = (
  task: TaskForMonthlyReport
): TaskForSummaryInConverting => ({
  id: TaskUtil.createId(task),
  taskTimeSum: 0,
  jobId: task.jobId,
  jobName: task.jobName,
  workCategoryId: task.workCategoryId,
  workCategoryName: task.workCategoryName,
});

const convertTaskListForSummary = (
  dailyList: DailyTrackList
): TaskListInConverting => {
  const list = {};

  for (const daily of Object.values(dailyList)) {
    daily.recordItemList.forEach((task) => {
      const taskId = TaskUtil.createId(task);

      if (!list[taskId]) {
        list[taskId] = createTaskForSummary(task);
      }

      list[taskId].taskTimeSum += task.taskTime;
    });
  }

  return list;
};

const convertSummaryTaskAllIds = (
  summaryTask: TaskListInConverting
): string[] => {
  const sortOrigin = [];

  for (const task of Object.values(summaryTask)) {
    sortOrigin.push({
      id: task.id,
      taskTimeSum: task.taskTimeSum,
    });
  }

  sortOrigin.sort((a, b) => {
    return b.taskTimeSum - a.taskTimeSum;
  });
  return sortOrigin.map((task) => {
    return task.id;
  });
};

const calcSummaryTaskTime = (taskList: TaskListInConverting) => {
  return Object.values(taskList).reduce((prev, task) => {
    return prev + task.taskTimeSum;
  }, 0);
};

const setTask = (
  allIds: string[],
  byId: Record<string, TaskForMonthlyReportSummary>
) => {
  return {
    type: constants.TIME_TRACK_MONTHLY_SET_SUMMARY_TASK,
    payload: {
      allIds,
      byId,
    },
  };
};

const setSum = (sumTaskTime: number) => {
  return {
    type: constants.TIME_TRACK_MONTHLY_SET_SUMMARY_SUM_TASK_TIME,
    payload: sumTaskTime,
  };
};

/**
 * 注意! - 破壊的
 * @param {Array} summaryTaskAllIds
 * @param {Object} taskList
 */
const addColorToTaskList = (
  summaryTaskAllIds: string[],
  taskList: TaskList
): Record<string, TaskForMonthlyReportSummary> => {
  summaryTaskAllIds.forEach((id) => {
    taskList[id].barColor = TaskColorUtil.getNextColor(colorCount).base;
    colorCount += 1;
  });
  return taskList;
};

/**
 * 注意! - 破壊的
 * @param {Array} summaryTaskAllIds
 * @param {Object} taskList
 */
const calcGraphRatio = (
  summaryTaskAllIds: string[],
  taskList: TaskList
): Record<string, TaskForMonthlyReportSummary> => {
  if (summaryTaskAllIds.length === 0) {
    // データがなかったら何もしない
    return;
  }

  const maxTaskTimeSum = taskList[summaryTaskAllIds[0]].taskTimeSum;
  summaryTaskAllIds.forEach((id) => {
    taskList[id].graphRatio = Math.floor(
      (taskList[id].taskTimeSum / maxTaskTimeSum) * 100
    );
  });
};

const addColorAndRatio = (
  summaryTaskAllIds: string[],
  taskList: TaskListInConverting
): TaskList => {
  const taskListCopied = Object.assign({}, taskList) as TaskList;
  // 破壊的メソッドをつかうため注意
  addColorToTaskList(summaryTaskAllIds, taskListCopied);
  calcGraphRatio(summaryTaskAllIds, taskListCopied);
  return taskListCopied;
};

// - public

/* eslint-disable import/prefer-default-export */
export const setSummaryTask = (dailyList: DailyTrackList) => (dispatch) => {
  // 画面描画し直しにつきリセット
  colorCount = 0;
  const taskList = convertTaskListForSummary(dailyList);
  const summaryTaskAllIds = convertSummaryTaskAllIds(taskList);
  const sum = calcSummaryTaskTime(taskList);
  const taskListAdded = addColorAndRatio(summaryTaskAllIds, taskList);
  dispatch(setTask(summaryTaskAllIds, taskListAdded));
  dispatch(setSum(sum));
};
