import { ApprovalTypeValue } from '@apps/domain/models/approval/ApprovalType';

import { AttendanceSummary, DailyRecord } from './AttendanceSummary';
import { Submitter } from './Submitter';

export type { Status } from '../FixDailyRequest';
export { STATUS } from '../FixDailyRequest';
export type {
  AnnualPaidLeaveDaysSummaryItem,
  AttendanceSummary,
  DailyRecord,
  DailyRecordTotal,
  GeneralSummaryItem,
  LeaveDaysSummaryItem,
  Summary,
  SummaryItem,
} from '@attendance/domain/models/approval/AttendanceSummary';

export type FixDailyRequest = {
  id: string;
  requestDate: string;
  submitter: Submitter;
  targetDate: string;
  targetRecord: DailyRecord | null;
} & AttendanceSummary;

export type IFixDailyRequestRepository = {
  fetchList: (param: {
    employeeId?: string;
    approvalType?: ApprovalTypeValue;
  }) => Promise<FixDailyRequest[]>;
  fetch: (requestId: string) => Promise<FixDailyRequest>;
};
