import { ApprovalHistory } from '@apps/domain/models/approval/request/History';

export type RequestHistory = ApprovalHistory;

export type IRequestHistoryRepository = {
  fetchList: (requestId: string) => Promise<ApprovalHistory[]>;
};
