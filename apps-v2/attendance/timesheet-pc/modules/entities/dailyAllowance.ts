import flow from 'lodash/fp/flow';
import keyBy from 'lodash/fp/keyBy';
import mapValues from 'lodash/fp/mapValues';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

// FIXME: 本来ならばドメインの型を使用するべきだが古い実装のために仕方なく使用している
import { DailyRecord as AttDailyRecordFromRemote } from '@attendance/repositories/models/DailyRecord';
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import { DailyRecordList } from '@attendance/domain/models/AttDailyAllowanceRecordList';
import {
  DailyAllowanceSummary,
  DailyRecordListFromRemote,
} from '@attendance/domain/models/AttDailyAllowanceSummary';

// State

export type AllowanceDailyRecord = {
  availableAllowanceCount?: number;
} & DailyRecordList;

export type State = {
  period: string;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
  attDailyAllowanceMap: {
    [key: string]: AllowanceDailyRecord;
  } | null;
};

const initialState = {
  period: null,
  departmentName: null,
  workingTypeName: null,
  employeeCode: null,
  employeeName: null,
  attDailyAllowanceMap: null,
};

// Actions
const FETCH_SUCCESS = 'TIMESHEET-PC/ENTITIES/DAILYALLOWANCR/FETCH_SUCCESS';
const UPDATE_RECORDS = 'TIMESHEET-PC/ENTITIES/DAILYALLOWANCR/UPDATE_RECORDS';
const CLEAR = 'TIMESHEET-PC/ENTITIES/DAILYALLOWANCR/CLEAR';

type Clear = {
  type: typeof CLEAR;
};

type FetchSuccess = {
  type: typeof FETCH_SUCCESS;
  payload: {
    dailyAllowanceSummary: DailyAllowanceSummary;
    timesheet: TimesheetFromRemote;
  };
};

type UpdateRecords = {
  type: typeof UPDATE_RECORDS;
  payload: {
    dailyAllowanceSummary: DailyAllowanceSummary;
  };
};

export type Action = FetchSuccess | UpdateRecords | Clear;

export const actions = {
  fetchSuccess: (
    dailyAllowanceSummary: DailyAllowanceSummary,
    timesheet: TimesheetFromRemote
  ): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: {
      dailyAllowanceSummary,
      timesheet,
    },
  }),
  updateRecords: (
    dailyAllowanceSummary: DailyAllowanceSummary
  ): UpdateRecords => ({
    type: UPDATE_RECORDS,
    payload: {
      dailyAllowanceSummary,
    },
  }),
  clear: (): Clear => ({
    type: CLEAR,
  }),
};

// Reducer

const createDailyAllowanceMap = (
  dailyAllowanceSummary: DailyAllowanceSummary,
  timesheet: TimesheetFromRemote
): { [key: string]: AllowanceDailyRecord } => {
  const dailyAllowanceMap = keyBy(
    (dailyAllowance: DailyRecordList) => dailyAllowance.recordDate,
    dailyAllowanceSummary.dailyRecordList
  );
  return flow(
    keyBy((record: AttDailyRecordFromRemote) => record.recordDate),
    mapValues((record) => ({
      ...dailyAllowanceMap[record.recordDate],
      availableAllowanceCount:
        !isNil(dailyAllowanceMap[record.recordDate]) &&
        !isEmpty(dailyAllowanceMap[record.recordDate].dailyAllowanceList)
          ? dailyAllowanceMap[record.recordDate].dailyAllowanceList.length
          : null,
    }))
  )(timesheet.records);
};

const createUpdateDailyAllowanceMap = (
  dailyAllowanceSummary: DailyAllowanceSummary
) => {
  const dailyAllowanceMap = keyBy(
    (dailyAllowance: DailyRecordList) => dailyAllowance.recordDate,
    dailyAllowanceSummary.dailyRecordList
  );
  return flow(
    keyBy(
      (dailyAllowance: DailyRecordListFromRemote) => dailyAllowance.recordDate
    ),
    mapValues((dailyAllowance) => ({
      ...dailyAllowanceMap[dailyAllowance.recordDate],
      availableAllowanceCount:
        dailyAllowanceMap[dailyAllowance.recordDate].dailyAllowanceList &&
        dailyAllowanceMap[dailyAllowance.recordDate].dailyAllowanceList.length >
          0
          ? dailyAllowanceMap[dailyAllowance.recordDate].dailyAllowanceList
              .length
          : null,
    }))
  )(dailyAllowanceSummary.dailyRecordList);
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      const { dailyAllowanceSummary, timesheet } = action.payload;
      const period = dailyAllowanceSummary.period;
      const departmentName = dailyAllowanceSummary.departmentName;
      const workingTypeName = dailyAllowanceSummary.workingTypeName;
      const employeeCode = dailyAllowanceSummary.employeeCode;
      const employeeName = dailyAllowanceSummary.employeeName;
      const attDailyAllowanceMap = createDailyAllowanceMap(
        dailyAllowanceSummary,
        timesheet
      );
      return {
        ...state,
        period,
        departmentName,
        workingTypeName,
        employeeCode,
        employeeName,
        attDailyAllowanceMap,
      };
    }
    case UPDATE_RECORDS: {
      const { dailyAllowanceSummary } = action.payload;
      const period = dailyAllowanceSummary.period;
      const departmentName = dailyAllowanceSummary.departmentName;
      const workingTypeName = dailyAllowanceSummary.workingTypeName;
      const employeeCode = dailyAllowanceSummary.employeeCode;
      const employeeName = dailyAllowanceSummary.employeeName;
      const updatingRecords = createUpdateDailyAllowanceMap(
        dailyAllowanceSummary
      );
      const attDailyAllowanceMap = keyBy(
        (dailyAllowance: AllowanceDailyRecord) => dailyAllowance.recordDate,
        state.attDailyAllowanceMap
      );

      if (
        !isNil(updatingRecords) &&
        !isNil(attDailyAllowanceMap) &&
        !isEmpty(dailyAllowanceSummary.dailyRecordList)
      ) {
        attDailyAllowanceMap[
          dailyAllowanceSummary.dailyRecordList[0].recordDate
        ] =
          updatingRecords[dailyAllowanceSummary.dailyRecordList[0].recordDate];
      }
      return {
        ...state,
        period,
        departmentName,
        workingTypeName,
        employeeCode,
        employeeName,
        attDailyAllowanceMap,
      };
    }
    case CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
};
