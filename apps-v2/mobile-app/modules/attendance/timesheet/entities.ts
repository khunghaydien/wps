import { createAttDailyAttentions } from '@attendance/domain/models/AttDailyAttention';
import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';
import * as AttDailyRequest from '@attendance/domain/models/AttDailyRequest';
import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';
import {
  isWithDeduction,
  isWithPayment,
  LEAVE_TYPE,
} from '@attendance/domain/models/LeaveType';
import {
  getAttDailyRecordByDate,
  getAttDailyRequestByRecordDate,
  STATUS,
  Timesheet,
} from '@attendance/domain/models/Timesheet';

import * as attentionHelper from '@attendance/ui/helpers/attentionDailyMessages';

/**
 * 行の表示種別
 */
export const ROW_TYPE = {
  // 勤務日
  WORKDAY: 'WORKDAY',
  // 所定休日
  HOLIDAY: 'HOLIDAY',
  // 法定休日
  LEGAL_HOLIDAY: 'LEGAL_HOLIDAY',
  // 全日無給
  ALL_DAY_UNPAID_LEAVE: 'ALL_DAY_UNPAID_LEAVE',
  // 全日有給
  ALL_DAY_PAID_LEAVE: 'ALL_DAY_PAID_LEAVE',
  // 午前有給
  AM_PAID_LEAVE: 'AM_PAID_LEAVE',
  // 午前無給
  AM_UNPAID_LEAVE: 'AM_UNPAID_LEAVE',
  // 午後有給
  PM_PAID_LEAVE: 'PM_PAID_LEAVE',
  // 午後無給
  PM_UNPAID_LEAVE: 'PM_UNPAID_LEAVE',
  // 午前有給/午後無給
  AM_PAID_LEAVE_PM_UNPAID_LEAVE: 'AM_PAID_LEAVE_PM_UNPAID_LEAVE',
  // 午前無給/午後有給
  AM_UNPAID_LEAVE_PM_PAID_LEAVE: 'AM_UNPAID_LEAVE_PM_PAID_LEAVE',
} as const;

type RowType = typeof ROW_TYPE[keyof typeof ROW_TYPE];

// FIXME: これはモバイルの ViewModel であるべき
export type AttDailyRecord = Timesheet['recordsByRecordDate'][string] & {
  rowType: RowType;
  remarkableRequestStatus: {
    count: number;
    status: AttDailyRequest.Status;
  } | null;
};

/**
 * 行の表示種別を判定する
 */
const determineRowType = (
  record: {
    dayType: DayType;
    isLeaveOfAbsence: boolean;
    isHolLegalHoliday: boolean;
  },
  hasAbsenceRequest: boolean,
  leaveRequests: LeaveRequest[],
  requests: AttDailyRequest.AttDailyRequest[]
): RowType => {
  const { dayType, isLeaveOfAbsence, isHolLegalHoliday } = record;

  // 休職・休業
  if (isLeaveOfAbsence) {
    const result = requests?.some(
      (request) =>
        request.requestTypeCode === CODE.Pattern &&
        request.status === AttDailyRequest.STATUS.APPROVED
    );
    if (!result) {
      return ROW_TYPE.ALL_DAY_UNPAID_LEAVE;
    }
  }
  // 欠勤
  if (hasAbsenceRequest) {
    const paidLeave = leaveRequests.find((request) =>
      isWithPayment(request.leaveType)
    );
    // 有給休暇がないなら全日無給
    if (!paidLeave) {
      return ROW_TYPE.ALL_DAY_UNPAID_LEAVE;
    }
    // 有給の午後半休がある場合: 無給/有給
    if (paidLeave.leaveRange === LEAVE_RANGE.PM) {
      return ROW_TYPE.AM_UNPAID_LEAVE_PM_PAID_LEAVE;
    }
    // 有給の午前半休・半日休・時間単位休がある場合: 有給/無給
    return ROW_TYPE.AM_PAID_LEAVE_PM_UNPAID_LEAVE;
  }

  // 法定休日自動判定
  if (isHolLegalHoliday && leaveRequests.length === 0) {
    return ROW_TYPE.LEGAL_HOLIDAY;
  }

  // 所定休日
  if (dayType === DAY_TYPE.Holiday) {
    // 無給休暇
    let result = leaveRequests?.some(
      (request) => request.leaveType === LEAVE_TYPE.Unpaid
    );
    if (result) {
      return ROW_TYPE.ALL_DAY_UNPAID_LEAVE;
    }
    // 有給休暇
    result = leaveRequests?.some(
      (request) => request.leaveType === LEAVE_TYPE.Paid
    );
    if (result) {
      return ROW_TYPE.ALL_DAY_PAID_LEAVE;
    }
    return ROW_TYPE.HOLIDAY;
  }

  // 法定休日
  if (dayType === DAY_TYPE.LegalHoliday) {
    return ROW_TYPE.LEGAL_HOLIDAY;
  }

  // 優先法定休日
  if (dayType === DAY_TYPE.PreferredLegalHoliday) {
    return ROW_TYPE.HOLIDAY;
  }
  // 休暇申請 (優先度: 全日休 > 午後半休 > 午前半休 > 半休 > 時間休)
  // 休暇が1つのみのケース
  if (leaveRequests.length === 1) {
    const leaveRequest = leaveRequests[0];
    // 全日休
    if (leaveRequest.leaveRange === LEAVE_RANGE.Day) {
      return isWithPayment(leaveRequest.leaveType)
        ? ROW_TYPE.ALL_DAY_PAID_LEAVE
        : ROW_TYPE.ALL_DAY_UNPAID_LEAVE;
    }
    // 午後半休
    if (leaveRequest.leaveRange === LEAVE_RANGE.PM) {
      return isWithPayment(leaveRequest.leaveType)
        ? ROW_TYPE.PM_PAID_LEAVE
        : ROW_TYPE.PM_UNPAID_LEAVE;
    }
    // 午前半休・半日休・時間単位休(いずれも同じ表示とする)
    return isWithPayment(leaveRequest.leaveType)
      ? ROW_TYPE.AM_PAID_LEAVE
      : ROW_TYPE.AM_UNPAID_LEAVE;
  }
  // 休暇が2つあるケース
  if (leaveRequests.length === 2) {
    // 午前半休＆午後半休の場合
    const haveAMPMLeaves =
      (leaveRequests[0].leaveRange === LEAVE_RANGE.AM &&
        leaveRequests[1].leaveRange === LEAVE_RANGE.PM) ||
      (leaveRequests[0].leaveRange === LEAVE_RANGE.PM &&
        leaveRequests[1].leaveRange === LEAVE_RANGE.AM);
    if (haveAMPMLeaves) {
      // 両方有給
      if (
        isWithPayment(leaveRequests[0].leaveType) &&
        isWithPayment(leaveRequests[1].leaveType)
      ) {
        return ROW_TYPE.ALL_DAY_PAID_LEAVE;
      }
      // 両方無給
      if (
        isWithDeduction(leaveRequests[0].leaveType) &&
        isWithDeduction(leaveRequests[1].leaveType)
      ) {
        return ROW_TYPE.ALL_DAY_UNPAID_LEAVE;
      }
      // 有給と無給
      return isWithPayment(leaveRequests[0].leaveType)
        ? ROW_TYPE.AM_PAID_LEAVE_PM_UNPAID_LEAVE
        : ROW_TYPE.AM_UNPAID_LEAVE_PM_PAID_LEAVE;
    }
    // 半日休x2がある場合は、どちらが午前・午後かの区別がないので、
    // どちらかの休暇種別に合わせる
    const have2HalfLeaves =
      leaveRequests[0].leaveRange === LEAVE_RANGE.Half &&
      leaveRequests[1].leaveRange === LEAVE_RANGE.Half;
    if (have2HalfLeaves) {
      return isWithPayment(leaveRequests[0].leaveType)
        ? ROW_TYPE.ALL_DAY_PAID_LEAVE
        : ROW_TYPE.ALL_DAY_UNPAID_LEAVE;
    }
    // 午前半休・午後半休・半日休のいずれかがあれば、時間単位休より優先的に表示
    const PMLeave = leaveRequests.find(
      (request) => request.leaveRange === LEAVE_RANGE.PM
    );
    if (PMLeave) {
      return isWithPayment(PMLeave.leaveType)
        ? ROW_TYPE.PM_PAID_LEAVE
        : ROW_TYPE.PM_UNPAID_LEAVE;
    }
    const AMorHalfLeave = leaveRequests.find(
      (request) =>
        request.leaveRange === LEAVE_RANGE.AM ||
        request.leaveRange === LEAVE_RANGE.Half
    );
    if (AMorHalfLeave) {
      return isWithPayment(AMorHalfLeave.leaveType)
        ? ROW_TYPE.AM_PAID_LEAVE
        : ROW_TYPE.AM_UNPAID_LEAVE;
    }
    // いずれも該当しなければ休暇1を参照する
    return isWithPayment(leaveRequests[0].leaveType)
      ? ROW_TYPE.AM_PAID_LEAVE
      : ROW_TYPE.AM_UNPAID_LEAVE;
  }
  // 勤務日
  return ROW_TYPE.WORKDAY;
};

export type State = Timesheet & {
  recordsByRecordDate: {
    [date: string]: AttDailyRecord;
  };
};

const ACTION_TYPES = {
  FETCH_SUCCESS:
    'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/ENTITIES/FETCH_SUCCESS',
  CLEAR: 'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/ENTITIES/CLEAR',
} as const;

type ActionTypes = typeof ACTION_TYPES;

type FetchSuccessAction = {
  type: ActionTypes['FETCH_SUCCESS'];
  payload: Timesheet;
};

type ClearAction = {
  type: ActionTypes['CLEAR'];
};

type Actions = FetchSuccessAction | ClearAction;

export const actions = {
  fetchSuccess: (timesheet: Timesheet): FetchSuccessAction => ({
    type: ACTION_TYPES.FETCH_SUCCESS,
    payload: timesheet,
  }),
  clear: (): ClearAction => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState: State = {
  id: '',
  recordAllRecordDates: [],
  recordsByRecordDate: {},
  periods: [],
  requestTypes: {},
  requestAllIds: [],
  requestsById: {},
  ownerInfos: [],
  startDate: '',
  endDate: '',
  requestId: '',
  status: STATUS.NOT_REQUESTED,
  approver01Name: '',
  workingTypes: [],
  isLocked: true,
  isAllAbsent: false,
  isMigratedSummary: false,
  dailyRestCountLimit: 0,
};

export default (state: State = initialState, action: Actions): State => {
  const { type } = action;
  switch (type) {
    case ACTION_TYPES.FETCH_SUCCESS:
      const { payload } = action;
      const timesheet = payload;
      const recordsByRecordDate = timesheet.recordAllRecordDates.reduce(
        (obj, key) => {
          const record = getAttDailyRecordByDate(key, timesheet);
          const requests = getAttDailyRequestByRecordDate(key, timesheet);
          const effectualLeaveRequests =
            AttDailyRequest.getEffectualLeaveRequests(requests);
          const hasAbsenceRequest =
            AttDailyRequest.hasEffectualAbsenceRequest(requests);
          const rowType =
            record === null
              ? ROW_TYPE.WORKDAY
              : determineRowType(
                  record,
                  hasAbsenceRequest,
                  effectualLeaveRequests,
                  requests
                );

          const remarkableRequestStatus =
            AttDailyRequest.getRemarkableRequestStatus(key, timesheet);

          let attentionMessages = null;
          if (record) {
            attentionMessages = attentionHelper.alert(
              createAttDailyAttentions(record)
            );
          }
          obj[key] = {
            ...getAttDailyRecordByDate(key, timesheet),
            rowType,
            remarkableRequestStatus,
            attentionMessages,
          };
          return obj;
        },
        {}
      );
      return {
        ...payload,
        recordsByRecordDate,
      };
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
