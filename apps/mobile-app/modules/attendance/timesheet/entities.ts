import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import STATUS, {
  Status,
} from '../../../../domain/models/approval/request/Status';
import {
  CODE,
  createAttDailyAttentions,
} from '../../../../domain/models/attendance/AttDailyAttention';
import {
  canEdit as canEditAttDailyRecord,
  DAY_TYPE,
  DayType,
  shouldInput as shouldInputAttDailyRecord,
} from '../../../../domain/models/attendance/AttDailyRecord';
import * as AttDailyRequest from '../../../../domain/models/attendance/AttDailyRequest';
import { LeaveRequest } from '../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import { LEAVE_RANGE } from '../../../../domain/models/attendance/LeaveRange';
import {
  isWithDeduction,
  isWithPayment,
} from '../../../../domain/models/attendance/LeaveType';
import {
  getAttDailyRecordByDate,
  getAttDailyRequestByRecordDate,
  Timesheet,
} from '../../../../domain/models/attendance/Timesheet';
import { defaultValue as workingTypeDefaultValue } from '../../../../domain/models/attendance/WorkingType';

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
};

type RowType = typeof ROW_TYPE[keyof typeof ROW_TYPE];

type AttDailyRecord = Timesheet['recordsByRecordDate'] & {
  rowType: RowType;
  shouldInput: boolean;
  canEdit: boolean;
  remarkableRequestStatus: {
    count: number;
    status: Status;
  } | null;
};

/**
 * 行の表示種別を判定する
 */
const determineRowType = (
  record: { dayType: DayType; isLeaveOfAbsence: boolean },
  hasAbsenceRequest: boolean,
  leaveRequests: LeaveRequest[]
): RowType => {
  const { dayType, isLeaveOfAbsence } = record;

  // 休職・休業
  if (isLeaveOfAbsence) {
    return ROW_TYPE.ALL_DAY_UNPAID_LEAVE;
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
  // 所定休日
  if (dayType === DAY_TYPE.Holiday) {
    return ROW_TYPE.HOLIDAY;
  }
  // 法定休日
  if (dayType === DAY_TYPE.LegalHoliday) {
    return ROW_TYPE.LEGAL_HOLIDAY;
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
    [key: string]: AttDailyRecord;
  };
};

const ACTIONS = {
  FETCH_SUCCESS:
    'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/ENTITIES/FETCH_SUCCESS',
  CLEAR: 'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/ENTITIES/CLEAR',
};

export const actions = {
  fetchSuccess: (timesheet: Timesheet) => ({
    type: ACTIONS.FETCH_SUCCESS,
    payload: timesheet,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
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
  employeeName: '',
  departmentName: '',
  workingTypeName: '',
  startDate: '',
  endDate: '',
  requestId: '',
  status: STATUS.NotRequested,
  approver01Name: '',
  isLocked: true,
  workingType: {
    ...workingTypeDefaultValue,
  },
  isAllAbsent: false,
  isMigratedSummary: false,
};

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.FETCH_SUCCESS:
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
                  effectualLeaveRequests
                );

          const shouldInput = shouldInputAttDailyRecord(key, timesheet);
          const canEdit = canEditAttDailyRecord(key, timesheet, shouldInput);
          const remarkableRequestStatus =
            AttDailyRequest.getRemarkableRequestStatus(key, timesheet);

          let attentionMessages = [''];
          if (record) {
            attentionMessages = createAttDailyAttentions(record).map((item) => {
              switch (item.code) {
                case CODE.InsufficientRestTime:
                  return TextUtil.template(
                    msg().Att_Msg_InsufficientRestTime,
                    item.value
                  );
                case CODE.IneffectiveWorkingTime:
                  return TextUtil.template(
                    msg().Att_Msg_NotIncludeWorkingTime,
                    TimeUtil.toHHmm(item.value.fromTime),
                    TimeUtil.toHHmm(item.value.toTime)
                  );
                default:
                  return '';
              }
            });
          }
          obj[key] = {
            ...getAttDailyRecordByDate(key, timesheet),
            rowType,
            shouldInput,
            canEdit,
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
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
};
