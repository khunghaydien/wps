import flow from 'lodash/fp/flow';
import keyBy from 'lodash/fp/keyBy';
import mapValues from 'lodash/fp/mapValues';

// FIXME: 本来ならばドメインの型を使用するべきだが古い実装のために仕方なく使用している
import { DailyRecord as AttDailyRecordFromRemote } from '@attendance/repositories/models/DailyRecord';
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import { DailyRecord } from '../../../../domain/models/time-tracking/DailyRecord';

// State

export type DailyTimeTrackRecord = {
  realWorkTime?: number;
  totalTaskTime?: number;
} & DailyRecord;

export type State = { [key: string]: DailyTimeTrackRecord };

const initialState = {};

// Actions

const FETCH_SUCCESS = 'TIMESHEET-PC/ENTITIES/DAILYTIMETRACK/FETCH_SUCCESS';
const UPDATE_RECORDS = 'TIMESHEET-PC/ENTITIES/DAILYTIMETRACK/UPDATE_RECORDS';
const CLEAR = 'TIMESHEET-PC/ENTITIES/DAILYTIMETRACK/CLEAR';

type Clear = {
  type: typeof CLEAR;
};

type FetchSuccess = {
  type: typeof FETCH_SUCCESS;
  payload: {
    dailyTimeTrackList: DailyRecord[];
    timesheet: TimesheetFromRemote;
  };
};

type UpdateRecords = {
  type: typeof UPDATE_RECORDS;
  payload: {
    dailyTimeTrackList: DailyRecord[];
    timesheet: TimesheetFromRemote;
  };
};

export type Action = FetchSuccess | UpdateRecords | Clear;

export const actions = {
  fetchSuccess: (
    dailyTimeTrackList: DailyRecord[],
    timesheet: TimesheetFromRemote
  ): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: {
      dailyTimeTrackList,
      timesheet,
    },
  }),
  updateRecords: (
    dailyTimeTrackList: DailyRecord[],
    timesheet: TimesheetFromRemote
  ): UpdateRecords => ({
    type: UPDATE_RECORDS,
    payload: {
      dailyTimeTrackList,
      timesheet,
    },
  }),
  clear: (): Clear => ({
    type: CLEAR,
  }),
};

// Reducer

const createTimeTrackMap = (
  dailyTimeTrackList: DailyRecord[],
  timesheet: TimesheetFromRemote
): { [key: string]: DailyTimeTrackRecord } => {
  const timeTrackingMap = keyBy(
    (track: DailyRecord) => track.targetDate,
    dailyTimeTrackList
  );
  return flow(
    keyBy((record: AttDailyRecordFromRemote) => record.recordDate),
    mapValues((record) => ({
      ...timeTrackingMap[record.recordDate],
      realWorkTime: record.realWorkTime,
      totalTaskTime: (timeTrackingMap[record.recordDate] || {}).time,
    }))
  )(timesheet.records);
};

const createUpdatedTimeTrackMap = (
  dailyTimeTrackList: DailyRecord[],
  timesheet: TimesheetFromRemote
) => {
  const recordMap = keyBy(({ recordDate }) => recordDate, timesheet.records);
  return flow(
    keyBy(({ targetDate }: DailyRecord) => targetDate),
    mapValues((track) => ({
      ...track,
      realWorkTime: (recordMap[track.targetDate] || {}).realWorkTime,
      totalTaskTime: track.time,
    }))
  )(dailyTimeTrackList);
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      const { dailyTimeTrackList, timesheet } = action.payload;
      return createTimeTrackMap(dailyTimeTrackList, timesheet);
    }

    case UPDATE_RECORDS: {
      const { dailyTimeTrackList, timesheet } = action.payload;
      const updatingRecords = createUpdatedTimeTrackMap(
        dailyTimeTrackList,
        timesheet
      );
      return {
        ...state,
        ...updatingRecords,
      };
    }

    case CLEAR: {
      return initialState;
    }

    default:
      return state;
  }
};
