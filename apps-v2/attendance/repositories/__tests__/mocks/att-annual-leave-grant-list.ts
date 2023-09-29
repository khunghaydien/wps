import { GrantHistoryRecord } from '@apps/admin-pc/models/leave-management/types';

export const recordId = 'xxxxxxx';

export const record = {
  id: recordId,
  validDateFrom: '2017-01-01',
  validDateTo: '2019-01-01',
  daysGranted: 10,
  daysLeft: 8.5,
  comment: '臨時付与',
} as GrantHistoryRecord;

export default {
  records: [record],
};
