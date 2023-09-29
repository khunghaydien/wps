import { Dispatch } from 'redux';

import { createSelector } from 'reselect';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';

// FIXME:
// Modules 内で Repository は呼びたくないのですが、
// 修正する時間がないので古いソースコードを踏襲しています。
import AttendanceSummaryRepository from '@attendance/repositories/AttendanceSummaryRepository';

import {
  AttendanceSummary,
  STATUS,
  Status,
} from '@apps/attendance/domain/models/AttendanceSummary';

import { State as RootState } from '../..';

/** Define types */

export type State = AttendanceSummary & {
  targetEmployeeId: string;
  masked: boolean;
};

export type FetchSuccessAction = {
  type: 'MODULES/ENTITIES/SUMMARY/FETCH_SUCCESS';
  payload: AttendanceSummary & {
    targetEmployeeId: string;
  };
};

export type Action = FetchSuccessAction;

/** Define constants */

const FETCH_SUCCESS: FetchSuccessAction['type'] =
  'MODULES/ENTITIES/SUMMARY/FETCH_SUCCESS';

export const constants = { FETCH_SUCCESS };

/** Define converters */

const isMasked = (status: Status) =>
  status !== STATUS.APPROVED && status !== STATUS.PENDING;

/** Define actions */

const fetchSuccess = (
  body: AttendanceSummary,
  targetEmployeeId?: string | null
): FetchSuccessAction => {
  return {
    type: FETCH_SUCCESS,
    payload: {
      ...body,
      targetEmployeeId,
    },
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

    return AttendanceSummaryRepository.fetch({
      employeeId: targetEmployeeId,
      targetDate,
    })
      .then((result) => dispatch(fetchSuccess(result, targetEmployeeId)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false })))
      .then(() => dispatch(loadingEnd()));
  };

export const actions = { fetch };

/** Define selectors */

const getRecords = (state: RootState) => state.entities.summary.records;

const periodStartDateSelector = createSelector(
  getRecords,
  (records) => records[0]?.recordDate || null
);

const closingDateSelector = createSelector(
  getRecords,
  (records) => records[records.length - 1]?.recordDate || null
);

export const selectors = {
  periodStartDateSelector,
  closingDateSelector,
};

/** Define reducer */

const initialState: State = {
  name: '',
  startDate: '',
  endDate: '',
  status: STATUS.NOT_REQUESTED,
  hasCalculatedAbsence: false,
  records: [],
  recordTotal: {
    restTime: null,
    realWorkTime: null,
    holidayWorkTime: null,
    overTime: null,
    nightTime: null,
    lostTime: null,
    virtualWorkTime: null,
  },
  summaries: [],
  dividedSummaries: [],
  attention: null,
  targetEmployeeId: '',
  ownerInfos: [],
  workingType: {
    useAllowanceManagement: false,
    useManageCommuteCount: false,
    useObjectivelyEventLog: false,
    useRestReason: false,
  },
  masked: false,
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...action.payload,
        masked: isMasked(action.payload.status),
      };
    default:
      return state;
  }
};
