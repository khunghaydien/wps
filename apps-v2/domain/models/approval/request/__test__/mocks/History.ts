import STATUS from '@apps/domain/models/approval/request/Status';

import { ApprovalHistory, ApprovalHistoryList } from '../../History';

export const histories: ApprovalHistory[] = [
  {
    id: 'historyId',
    stepName: 'Step Name',
    approveTime: '2020-01-03 07:30',
    status: STATUS.Approved,
    statusLabel: 'Status Label',
    approverName: 'Approver Name',
    actorName: 'Actor Name',
    actorPhotoUrl: 'actor-photo-url',
    comment: 'History Comment',
    isDelegated: false,
    actorId: 'actorId',
    isPending: false,
  },
];

export const defaultValue: ApprovalHistoryList = {
  historyList: histories,
};
