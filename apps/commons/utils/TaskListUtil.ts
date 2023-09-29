import TaskUtil from '../../time-tracking/tracking-pc/utils/TaskUtil';

import TaskColorUtil from './TaskColorUtil';

// グラフ色計算用カウンター
// 表示対象月度が変更されるたびにリセット
// 工数入力でタスクを追加した場合はリセットしないこと
let colorCount = 0;

// - private

export const createTaskForSummary = (task) => {
  return {
    id: TaskUtil.createId(task),
    taskTimeSum: 0,
    jobId: task.jobId,
    jobName: task.jobName,
    workCategoryId: task.workCategoryId,
    workCategoryName: task.workCategoryName,
  };
};

export const convertTaskListForSummary = (dailyList) => {
  const list = {};

  for (const daily of Object.values(dailyList)) {
    (daily as any).recordItemList.forEach((task) => {
      const taskId = TaskUtil.createId(task);

      if (!list[taskId]) {
        list[taskId] = createTaskForSummary(task);
      }

      list[taskId].taskTimeSum += task.taskTime;
    });
  }

  return list;
};

export const convertSummaryTaskAllIds = (summaryTask) => {
  const sortOrigin = [];
  for (const task of Object.values(summaryTask)) {
    sortOrigin.push({
      id: (task as any).id,
      taskTimeSum: (task as any).taskTimeSum,
    });
  }

  sortOrigin.sort((a, b) => {
    return b.taskTimeSum - a.taskTimeSum;
  });

  return sortOrigin.map((task) => {
    return task.id;
  });
};

export const calcSummaryTaskTime = (taskList) => {
  return Object.values(taskList).reduce((prev, task) => {
    return prev + (task as any).taskTimeSum;
  }, 0);
};

/**
 * 注意! - 破壊的
 * @param {Array} summaryTaskAllIds
 * @param {Object} taskList
 */
export const addColorToTaskList = (summaryTaskAllIds, taskList) => {
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
export const calcGraphRatio = (summaryTaskAllIds, taskList) => {
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

export const addColorAndRatio = (summaryTaskAllIds, taskList) => {
  const taskListCopyed = Object.assign({}, taskList);

  // 破壊的メソッドをつかうため注意
  addColorToTaskList(summaryTaskAllIds, taskList);
  calcGraphRatio(summaryTaskAllIds, taskList);

  return taskListCopyed;
};

// - public

/* eslint-disable import/prefer-default-export */
export const convertSummaryTask = (dailyList) => {
  // 画面描画し直しにつきリセット
  colorCount = 0;

  const taskList = convertTaskListForSummary(dailyList);
  const summaryTaskAllIds = convertSummaryTaskAllIds(taskList);
  const taskListAdded = addColorAndRatio(summaryTaskAllIds, taskList);

  return {
    taskList: taskListAdded,
    summaryTaskAllIds,
  };
};
