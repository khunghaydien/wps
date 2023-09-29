import { ApprovalHistoryList } from '@apps/domain/models/approval/request/History';
import { AttendanceSummary } from '@attendance/domain/models/approval/AttendanceSummary';
import { Status } from '@attendance/domain/models/AttFixSummaryRequest';

import { Submitter } from './Submitter';

export type {
  AnnualPaidLeaveDaysSummaryItem,
  AttendanceSummary,
  BaseSummaryItem,
  DailyRecord,
  GeneralSummaryItem,
  LeaveDaysSummaryItem,
  Summary,
  SummaryItem,
  SummaryItemName,
} from '@attendance/domain/models/approval/AttendanceSummary';
export { STATUS } from '@attendance/domain/models/AttFixSummaryRequest';
export { SUMMARY_ITEM_NAME } from '@attendance/domain/models/BaseAttendanceSummary';

export type { Status };

export type FixMonthlyRequest = {
  id: string;
  status: Status;
  submitter: Submitter;
  comment: string;
} & AttendanceSummary &
  ApprovalHistoryList;

export type IFixMonthlyRequestRepository = {
  fetch: (id: string) => Promise<FixMonthlyRequest>;
};
