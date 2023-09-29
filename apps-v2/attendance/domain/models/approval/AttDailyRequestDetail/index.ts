import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { AbsenceRequest, AbsenceRequestDetail } from './Absence';
import { REQUEST_TYPE } from './Base';
import { DirectRequest, DirectRequestDetail } from './Direct';
import { EarlyLeaveRequest, EarlyLeaveRequestDetail } from './EarlyLeave';
import {
  EarlyStartWorkRequest,
  EarlyStartWorkRequestDetail,
} from './EarlyStartWork';
import { HolidayWorkRequest, HolidayWorkRequestDetail } from './HolidayWork';
import { LateArrivalRequest, LateArrivalRequestDetail } from './LateArrival';
import { LeaveRequest, LeaveRequestDetail } from './Leave';
import { NoneRequestDetail } from './None';
import { OvertimeWorkRequest, OvertimeWorkRequestDetail } from './OvertimeWork';
import { PatternRequest, PatternRequestDetail } from './Pattern';

export type { AbsenceRequest } from './Absence';
export type { Status } from './Base';
export { REQUEST_TYPE, STATUS } from './Base';
export type { DirectRequest } from './Direct';
export type { EarlyLeaveRequest } from './EarlyLeave';
export type { EarlyStartWorkRequest } from './EarlyStartWork';
export type { HolidayWorkRequest } from './HolidayWork';
export type { LateArrivalRequest } from './LateArrival';
export type { LeaveRequest } from './Leave';
export type { NoneRequest } from './None';
export type { OvertimeWorkRequest } from './OvertimeWork';
export type { PatternRequest } from './Pattern';

export type AttDailyRequestDetail =
  | AbsenceRequestDetail
  | DirectRequestDetail
  | EarlyStartWorkRequestDetail
  | HolidayWorkRequestDetail
  | LeaveRequestDetail
  | NoneRequestDetail
  | OvertimeWorkRequestDetail
  | PatternRequestDetail
  | LateArrivalRequestDetail
  | EarlyLeaveRequestDetail;

export const LEAVE_RANGE_TYPE = {
  DAY: 'Day',
  AM: 'AM',
  PM: 'PM',
  HALF: 'Half',
  TIME: 'Time',
} as const;

export const ABSENCE_RANGE_TYPE = {
  DAY: 'Day',
} as const;

export const SUBSTITUTE_LEAVE_TYPE = {
  Substitute: 'Substitute',
  CompensatoryStocked: 'CompensatoryStocked',
} as const;

export const LEAVE_RANGE_LABEL = {
  [LEAVE_RANGE_TYPE.DAY]: 'Att_Lbl_DayLeave',
  [LEAVE_RANGE_TYPE.AM]: 'Att_Lbl_AMLeave',
  [LEAVE_RANGE_TYPE.PM]: 'Att_Lbl_PMLeave',
  [LEAVE_RANGE_TYPE.HALF]: 'Att_Lbl_HalfDayLeave',
  [LEAVE_RANGE_TYPE.TIME]: 'Att_Lbl_TimeLeave',
} as const;

export const SUBSTITUTE_LEAVE_TYPE_LABEL = {
  [SUBSTITUTE_LEAVE_TYPE.Substitute]: '$Att_Lbl_SubstituteLeave',
  [SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]: 'Att_Lbl_CompensatoryLeave',
  '': null,
} as const;

export const getDateOrRange = (detail: LeaveRequest): string => {
  const startDate = detail.startDate;
  const endDate = detail.endDate;

  if (detail.leaveRange === LEAVE_RANGE_TYPE.TIME) {
    return `${DateUtil.formatYMD(detail.startDate)} ${TimeUtil.toHHmm(
      detail.startTime
    )}-${TimeUtil.toHHmm(detail.endTime)}`;
  }

  if (detail.leaveRange === LEAVE_RANGE_TYPE.DAY && startDate !== endDate) {
    return `${DateUtil.formatYMD(startDate)}–${DateUtil.formatYMD(endDate)}`;
  }

  return DateUtil.formatYMD(startDate);
};

export const getDateWithTimeRange = (
  detail: HolidayWorkRequest | EarlyStartWorkRequest | OvertimeWorkRequest
): string => {
  return `${DateUtil.formatYMD(detail.startDate)} ${TimeUtil.toHHmm(
    detail.startTime
  )}–${TimeUtil.toHHmm(detail.endTime)}`;
};

/**
 * Get a period of requests.
 */
export const getPeriod = (
  detail:
    | LeaveRequest
    | HolidayWorkRequest
    | EarlyStartWorkRequest
    | OvertimeWorkRequest
    | AbsenceRequest
    | DirectRequest
    | PatternRequest
    | LateArrivalRequest
    | EarlyLeaveRequest
): string => {
  switch (detail.type) {
    case REQUEST_TYPE.Leave:
      return getDateOrRange(detail as LeaveRequest);

    case REQUEST_TYPE.HolidayWork:
      return getDateWithTimeRange(detail as HolidayWorkRequest);

    case REQUEST_TYPE.EarlyStartWork:
      return getDateWithTimeRange(detail as EarlyStartWorkRequest);

    case REQUEST_TYPE.OvertimeWork:
      return getDateWithTimeRange(detail as OvertimeWorkRequest);

    case REQUEST_TYPE.LateArrival:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.EarlyLeave:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.Absence:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.Direct:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.Pattern:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    default:
      return '';
  }
};

export type IAttDailyRequestDetailRepository = {
  fetch: (id: string) => Promise<AttDailyRequestDetail>;
};
