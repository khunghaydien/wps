import { AbsenceRequest } from './AbsenceRequest';
import { EarlyLeaveRequest } from './EarlyLeaveRequest';
import { EarlyStartWorkRequest } from './EarlyStartWorkRequest';
import { HolidayWorkRequest } from './HolidayWorkRequest';
import { LateArrivalRequest } from './LateArrivalRequest';
import { LeaveRequest } from './LeaveRequest';
import { OvertimeWorkRequest } from './OvertimeWorkRequest';

export {
  type AbsenceRequest,
  EarlyLeaveRequest,
  EarlyStartWorkRequest,
  HolidayWorkRequest,
  LateArrivalRequest,
  LeaveRequest,
  OvertimeWorkRequest,
};

export type DailyRequest =
  | AbsenceRequest
  | EarlyLeaveRequest
  | EarlyStartWorkRequest
  | HolidayWorkRequest
  | LateArrivalRequest
  | LeaveRequest
  | OvertimeWorkRequest;
