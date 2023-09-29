import { max } from 'lodash';

import TaskUtil from '../../../time-tracking/tracking-pc/utils/TaskUtil';

import { TaskForMonthlyReport, TaskForMonthlyReportFromRemote } from './Task';

export type FromRemote = {
  records: [
    {
      recordDate: string;
      note: string | null | undefined;
      recordItemList: TaskForMonthlyReportFromRemote[];
    }
  ];
};

type DailyTrack = {
  recordDate: string;
  note: string | null | undefined;
  recordItemList: TaskForMonthlyReport[];
  sumTaskTime: number;
};

export type DailyTrackList = {
  [recordDate: string]: DailyTrack;
};

const getMaxTaskTime = (dailyList): number => {
  const taskTimeList = [];

  dailyList.forEach((daily) => {
    daily.recordItemList.forEach((task) => {
      if (typeof task.taskTime === 'number') {
        taskTimeList.push(task.taskTime);
      }
    });
  });

  return max(taskTimeList);
};

export const convertDailyTrackList = (result: FromRemote): DailyTrackList => {
  const dailyList = result.records;
  const maxTaskTime = getMaxTaskTime(dailyList);

  const dailyTrackList = {};

  dailyList.forEach((daily) => {
    const taskList = [];

    daily.recordItemList.forEach((recordItem) => {
      // 工数のないタスクは除外する
      if (typeof recordItem.taskTime === 'number' && recordItem.taskTime > 0) {
        taskList.push({
          ...recordItem,
          graphRatio: Math.floor((recordItem.taskTime / maxTaskTime) * 100),
          id: TaskUtil.createId(recordItem),
        });
      }
    });

    const sumTaskTime = daily.recordItemList.reduce((prev, task) => {
      return prev + task.taskTime;
    }, 0);

    dailyTrackList[daily.recordDate] = {
      recordDate: daily.recordDate,
      note: daily.note,
      recordItemList: taskList,
      sumTaskTime,
    };
  });

  return dailyTrackList;
};

export default { convertDailyTrackList };
