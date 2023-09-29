import { Dispatch } from 'redux';

import { createSelector } from 'reselect';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import Api from '../../../../commons/api';
import ObjectUtil from '../../../../commons/utils/ObjectUtil';

import {
  AttDailyAttention,
  createAttDailyAttentions,
} from '../../../../domain/models/attendance/AttDailyAttention';
import { Record } from '../../../models/Record';
import { Status } from '../../../models/Status';
import { Summary } from '../../../models/Summary';
import { SummaryBlock } from '../../../models/SummaryBlock';
import { convertFromResponse, SummaryItem } from '../../../models/SummaryItem';

import { State as RootState } from '../..';

/** Define types */

type Records = {
  allIds: string[];
  byId: {
    [key: string]: Record;
  };
};

type Items = {
  allIds: string[];
  byId: {
    [key: string]: SummaryItem;
  };
};

type Summaries = {
  allIds: string[];
  byId: {
    [key: string]: {
      name: string;
      items: Items;
    };
  };
};

type Attentions = {
  allIds: string[];
  byId: {
    [key: string]: AttDailyAttention[];
  };
};

export type State = {
  summaryName: string;
  status: string;
  hasCalculatedAbsence: boolean;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
  records: Records;
  summaries: Summaries;
  attentions: Attentions;
};

export type FetchSuccessAction = {
  type: 'MODULES/ENTITIES/SUMMARY/FETCH_SUCCESS';
  payload: Summary;
};

export type Action = FetchSuccessAction;

/** Define constants */

const FETCH_SUCCESS: FetchSuccessAction['type'] =
  'MODULES/ENTITIES/SUMMARY/FETCH_SUCCESS';

export const constants = { FETCH_SUCCESS };

/** Define converters */

const convertRecord = (record: Record): Record => ({
  recordDate: record.recordDate,
  dayType: record.dayType,
  event: record.event,
  shift: record.shift,
  commuteCountForward: record.commuteCountForward,
  commuteCountBackward: record.commuteCountBackward,
  startTime: record.startTime,
  startStampTime: record.startStampTime,
  startTimeModified:
    record.startTime !== null && record.startTime !== record.startStampTime,
  endTime: record.endTime,
  endStampTime: record.endStampTime,
  endTimeModified:
    record.endTime !== null && record.endTime !== record.endStampTime,
  restTime: record.restTime,
  realWorkTime: record.realWorkTime,
  overTime: record.overTime,
  nightTime: record.nightTime,
  holidayWorkTime: record.holidayWorkTime,
  lostTime: record.lostTime,
  insufficientRestTime: record.insufficientRestTime,
  virtualWorkTime: record.virtualWorkTime,
  outStartTime: record.outStartTime,
  outEndTime: record.outEndTime,
  remarks: record.remarks,
});

const convertRecords = (records: Record[]): Records => ({
  allIds: records.map((record) => record.recordDate),
  byId: Object.assign(
    {},
    ...records.map((record) => ({
      [record.recordDate]: convertRecord(record),
    }))
  ),
});

const convertSummaryItems = (
  items: SummaryItem[],
  status: Status,
  hasCalculatedAbsence: boolean
) => ({
  allIds: items.map((item) => item.name),
  byId: Object.assign(
    {},
    ...items.map((item) => ({
      [item.name]: convertFromResponse(item, status, hasCalculatedAbsence),
    }))
  ),
});

const convertSummaries = (
  summaries: SummaryBlock[],
  status: Status,
  hasCalculatedAbsence: boolean
): Summaries => {
  const $summaries = summaries
    // 時育児休業は警告用の項目なので表示させない
    .filter(
      (summary) =>
        summary.name !== 'PaternityLeaveAtBirthSummary' &&
        summary.name !== 'ChildCareAllowanceSummary' &&
        summary.name !== 'ChildCareSummary'
    );

  return {
    allIds: $summaries.map((summary) => summary.name),
    byId: Object.assign(
      {},
      ...$summaries.map((summary) => ({
        [summary.name]: {
          name: summary.name,
          items: convertSummaryItems(
            summary.items,
            status,
            hasCalculatedAbsence
          ),
        },
      }))
    ),
  };
};

const convertAttentions = (records: Record[]): Attentions => {
  const allIds = records.map(({ recordDate }) => recordDate);
  const byId = records.reduce((obj, record) => {
    obj[record.recordDate] = createAttDailyAttentions(record);
    return obj;
  }, {});
  return {
    allIds,
    byId,
  };
};

const convertSummaryEntity = (body: Summary): State => ({
  summaryName: body.summaryName,
  status: body.status,
  hasCalculatedAbsence: body.hasCalculatedAbsence,
  departmentName: body.departmentName,
  workingTypeName: body.workingTypeName,
  employeeCode: body.employeeCode,
  employeeName: body.employeeName,
  records: convertRecords(body.records),
  summaries: convertSummaries(
    body.summaries,
    body.status,
    body.hasCalculatedAbsence
  ),
  attentions: convertAttentions(body.records),
});

export const converters = { convertSummaryEntity };

/** Define actions */

const fetchSuccess = (body: Summary): FetchSuccessAction => {
  return {
    type: FETCH_SUCCESS,
    payload: body,
  };
};

/**
 * @param targetDate date on the month. Must be formatted ISO-8601.
 * @param [targetEmployeeId=null] The ID of target employee
 */
const fetch =
  (targetDate: string, targetEmployeeId: string | null | undefined = null) =>
  (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());

    const req = {
      path: '/att/summary/get',
      param: {
        targetDate,
        empId: targetEmployeeId,
      },
    };

    return Api.invoke(req)
      .then((result) => dispatch(fetchSuccess(result)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false })))
      .then(() => dispatch(loadingEnd()));
  };

export const actions = { fetch };

/** Define selectors */

const getRecords = (state: RootState) => state.entities.summary.records;

const recordsSelector = createSelector(getRecords, (records) =>
  records.allIds.map((id) => records.byId[id])
);

const attentionsSelector = (state: RootState) =>
  state.entities.summary.attentions.byId;

const closingDateSelector = createSelector(getRecords, (records) => {
  const dateStrList = records.allIds || [];
  return dateStrList[dateStrList.length - 1];
});

const restTimeTotalSelector = createSelector(getRecords, (records) =>
  records.allIds.reduce(
    (total, id) =>
      total + ObjectUtil.getOrDefault(records.byId[id], 'restTime', 0),
    0
  )
);

const realWorkTimeTotalSelector = createSelector(getRecords, (records) =>
  records.allIds.reduce(
    (total, id) =>
      total + ObjectUtil.getOrDefault(records.byId[id], 'realWorkTime', 0),
    0
  )
);

const overTimeTotalSelector = createSelector(getRecords, (records) =>
  records.allIds.reduce(
    (total, id) =>
      total + ObjectUtil.getOrDefault(records.byId[id], 'overTime', 0),
    0
  )
);

const nightTimeTotalSelector = createSelector(getRecords, (records) =>
  records.allIds.reduce(
    (total, id) =>
      total + ObjectUtil.getOrDefault(records.byId[id], 'nightTime', 0),
    0
  )
);

const virtualWorkTimeTotalSelector = createSelector(getRecords, (records) =>
  records.allIds.reduce(
    (total, id) =>
      total + ObjectUtil.getOrDefault(records.byId[id], 'virtualWorkTime', 0),
    0
  )
);

const holidayWorkTimeTotalSelector = createSelector(getRecords, (records) =>
  records.allIds.reduce(
    (total, id) =>
      total + ObjectUtil.getOrDefault(records.byId[id], 'holidayWorkTime', 0),
    0
  )
);

const lostTimeTotalSelector = createSelector(getRecords, (records) =>
  records.allIds.reduce(
    (total, id) =>
      total + ObjectUtil.getOrDefault(records.byId[id], 'lostTime', 0),
    0
  )
);

const getSummaries = (state) => state.entities.summary.summaries;

// Aggregate summary selectors to one selector to achieve better performance.

const summariesSelector = createSelector(getSummaries, (summaries: Summaries) =>
  summaries.allIds
    .map((id) => summaries.byId[id])
    .map((summary) => ({
      name: summary.name,
      items: summary.items.allIds.map((id) => summary.items.byId[id]),
    }))
);

export const selectors = {
  recordsSelector,
  attentionsSelector,
  closingDateSelector,
  restTimeTotalSelector,
  realWorkTimeTotalSelector,
  overTimeTotalSelector,
  nightTimeTotalSelector,
  virtualWorkTimeTotalSelector,
  holidayWorkTimeTotalSelector,
  lostTimeTotalSelector,
  summariesSelector,
};

/** Define reducer */

const initialState: State = {
  summaryName: '',
  status: '',
  hasCalculatedAbsence: false,
  departmentName: '',
  workingTypeName: '',
  employeeCode: '',
  employeeName: '',
  records: {
    allIds: [],
    byId: {},
  },
  summaries: {
    allIds: [],
    byId: {},
  },
  attentions: {
    allIds: [],
    byId: {},
  },
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      const summary = convertSummaryEntity(action.payload as Summary);
      return {
        ...summary,
      };
    default:
      return state;
  }
};
