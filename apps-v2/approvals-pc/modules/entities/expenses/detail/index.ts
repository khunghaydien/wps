import { createSelector } from 'reselect';

import * as appActions from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

/** Define constants */

const FETCH_SUCCESS = 'MODULES/ENTITIES/ATT_MONTHLY/DETAIL/FETCH_SUCCESS';
// Used when there're no requests to show
const CLEAR = 'MODULES/ENTITIES/ATT_MONTHLY/DETAIL/CLEAR';

export const constants = { FETCH_SUCCESS, CLEAR };

/** Define converters */

const addAttributesToItem = (item) => {
  switch (item.name) {
    case 'AnnualPaidLeaveDaysLeft':
      return {
        ...item,
        isAsAtClosingDate: true,
      };

    default:
      return item;
  }
};

const convertRecord = (record) => ({
  recordDate: record.recordDate,
  dayType: record.dayType,
  event: record.event,
  shift: record.shift,
  startTime: record.startTime,
  startTimeModified:
    record.startTime !== null && record.startTime !== record.startStampTime,
  endTime: record.endTime,
  endTimeModified:
    record.endTime !== null && record.endTime !== record.endStampTime,
  restTime: record.restTime,
  realWorkTime: record.realWorkTime,
  overTime: record.overTime,
  nightTime: record.nightTime,
  lostTime: record.lostTime,
  remarks: record.remarks,
});

const convertRecords = (records) => ({
  allIds: records.map((record) => record.recordDate),
  byId: Object.assign(
    {},
    ...records.map((record) => ({
      [record.recordDate]: convertRecord(record),
    }))
  ),
});

const convertSummaryItems = (items) => ({
  allIds: items.map((item) => item.name),
  byId: Object.assign(
    {},
    ...items.map((item) => ({ [item.name]: addAttributesToItem(item) }))
  ),
});

const convertSummaries = (summaries) => ({
  allIds: summaries.map((summary) => summary.name),
  byId: Object.assign(
    {},
    ...summaries.map((summary) => ({
      [summary.name]: {
        name: summary.name,
        items: convertSummaryItems(summary.items),
      },
    }))
  ),
});

const convertHistoryList = (historyList) => ({
  allIds: historyList.map((history) => history.id),
  byId: Object.assign(
    {},
    ...historyList.map((history) => ({ [history.id]: history }))
  ),
});

const convertDetailEntity = (body) => ({
  id: body.id,
  status: body.status,
  employeeName: body.employeeName,
  employeePhotoUrl: body.employeePhotoUrl,
  delegatedEmployeeName: body.delegatedEmployeeName,
  comment: body.comment,
  records: convertRecords(body.records),
  historyList: convertHistoryList(body.historyList),
  summaries: convertSummaries(body.summaries),
});

export const converters = { convertDetailEntity };

/** Define actions */

const fetchSuccess = (result) => (dispatch) => {
  dispatch({
    type: FETCH_SUCCESS,
    payload: convertDetailEntity(result),
  });
};

const browse = (requestId) => (dispatch) => {
  dispatch(appActions.loadingStart());

  const req = {
    path: '/att/request/monthly/get',
    param: {
      requestId,
    },
  };

  return Api.invoke(req)
    .then((result) => dispatch(fetchSuccess(result)))
    .catch((err) =>
      dispatch(appActions.catchApiError(err, { isContinuable: true }))
    )
    .then(() => dispatch(appActions.loadingEnd()));
};

const clear = () => ({
  type: CLEAR,
});

export const actions = { browse, clear };

/** Define selectors */

const getRecords = (state) => state.entities.attMonthly.detail.records;

const getHistoryList = (state) => state.entities.attMonthly.detail.historyList;

const recordsSelector = createSelector(getRecords, (records) =>
  records.allIds.map((id) => records.byId[id])
);

const closingDateSelector = createSelector(getRecords, (records) => {
  const dateStrList = records.allIds || [];
  return dateStrList[dateStrList.length - 1];
});

const totalTimeSelectorCreator = (fieldGetter) =>
  createSelector(getRecords, (records) =>
    records.allIds
      .map((id) => records.byId[id])
      .map(fieldGetter)
      .filter((field) => !!field)
      .reduce((total, fieldValue) => total + fieldValue, 0)
  );

const restTimeTotalSelector = totalTimeSelectorCreator(
  (record) => record.restTime
);
const realWorkTimeTotalSelector = totalTimeSelectorCreator(
  (record) => record.realWorkTime
);
const overTimeTotalSelector = totalTimeSelectorCreator(
  (record) => record.overTime
);
const nightTimeTotalSelector = totalTimeSelectorCreator(
  (record) => record.nightTime
);
const lostTimeTotalSelector = totalTimeSelectorCreator(
  (record) => record.lostTime
);

const getSummaries = (state) => state.entities.attMonthly.detail.summaries;

// Aggregate summary selectors to one selector to achieve better performance.

const summariesSelector = createSelector(getSummaries, (summaries) =>
  summaries.allIds
    .map((id) => summaries.byId[id])
    .map((summary) => ({
      name: summary.name,
      items: summary.items.allIds.map((id) => summary.items.byId[id]),
    }))
);

const historyListSelector = createSelector(getHistoryList, (historyList) =>
  historyList.allIds.map((id) => historyList.byId[id])
);

export const selectors = {
  historyListSelector,
  recordsSelector,
  closingDateSelector,
  restTimeTotalSelector,
  realWorkTimeTotalSelector,
  overTimeTotalSelector,
  nightTimeTotalSelector,
  lostTimeTotalSelector,
  summariesSelector,
};

/** Define reducer */

const initialState = {
  id: '',
  status: '',
  employeeName: '',
  employeePhotoUrl: '',
  delegatedEmployeeName: '',
  comment: '',
  historyList: {
    allIds: [],
    byId: {},
  },
  records: {
    allIds: [],
    byId: {},
  },
  summaries: {
    allIds: [],
    byId: {},
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR:
      return initialState;
    default:
      return state;
  }
};
