import { create } from '@attendance/libraries/Event';

export default {
  approved: create<string | void>('approved'),
  rejected: create<string>('rejected'),
  switchedApprovalType: create<void>('switchedApprovalType'),
};
