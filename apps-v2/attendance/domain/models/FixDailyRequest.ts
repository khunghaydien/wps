// 相互参照になっているので型以外はインポートしないこと
import { DailyRecord as AttDailyRecordFromRemote } from '@attendance/repositories/models/DailyRecord';

import $STATUS from '@apps/domain/models/approval/request/Status';

import {
  ActionsForFix,
  detectPerformableActionForFix,
} from './AttFixSummaryRequest';

export {
  ACTIONS_FOR_FIX,
  detectPerformableActionForFix,
  getPermissionTestConditionsForActionForFix,
} from './AttFixSummaryRequest';
export type { ActionsForFix };

export const STATUS = {
  NOT_REQUESTED: $STATUS.NotRequested,
  APPROVED: $STATUS.Approved,
  PENDING: $STATUS.Pending,
  CANCELED: $STATUS.Canceled,
  REJECTED: $STATUS.Rejected,
  RECALLED: $STATUS.Recalled,
} as const;

export type Status = Value<typeof STATUS>;

export type FixDailyRequest = {
  id: string;
  status: Status;
  approver01Name: string;
  performableActionForFix: ActionsForFix;
};

export type FixDailyRequestFromRemote = {
  id: string;
  status: Status;
  approver01Name: string;
};

export const createFromRemote = (
  record: AttDailyRecordFromRemote,
  dailyRecords: AttDailyRecordFromRemote[]
): FixDailyRequest => {
  if (!record.fixDailyRequest) {
    return {
      id: '',
      status: STATUS.NOT_REQUESTED,
      approver01Name: getFixDailyRequestApprover(dailyRecords, record.id),
      performableActionForFix: detectPerformableActionForFix(
        STATUS.NOT_REQUESTED
      ),
    };
  } else {
    return {
      ...record.fixDailyRequest,
      approver01Name: getFixDailyRequestApprover(dailyRecords, record.id),
      performableActionForFix: detectPerformableActionForFix(
        record.fixDailyRequest.status
      ),
    };
  }
};

export const getFixDailyRequestApprover = <
  T extends Pick<AttDailyRecordFromRemote, 'id' | 'approver01Name'> &
    Partial<Pick<AttDailyRecordFromRemote, 'fixDailyRequest'>>
>(
  dailyRecords: T[],
  id: string
): string => {
  const currentDailyRecord = dailyRecords.find((record) => record.id === id);

  const currentFixDailyRecord = currentDailyRecord
    ? currentDailyRecord.fixDailyRequest
    : null;
  if (
    currentFixDailyRecord &&
    (currentFixDailyRecord.status === STATUS.PENDING ||
      currentFixDailyRecord.status === STATUS.APPROVED)
  ) {
    return currentFixDailyRecord.approver01Name || '';
  } else if (currentDailyRecord) {
    return currentDailyRecord.approver01Name || '';
  } else {
    return '';
  }
};

export type IFixDailyRequestRepository = {
  submit: (recordId: string) => Promise<void>;
  canSubmit: (requestId: string) => Promise<{
    confirmation: string[] | null;
  }>;
  cancelSubmitted: (requestId: string) => Promise<void>;
  cancelApproval: (requestId: string) => Promise<void>;
};
