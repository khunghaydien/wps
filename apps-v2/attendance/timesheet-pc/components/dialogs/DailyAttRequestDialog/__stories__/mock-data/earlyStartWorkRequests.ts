import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  EarlyStartWorkRequest,
} from '@attendance/domain/models/AttDailyRequest/EarlyStartWorkRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

export const defaultValues: EarlyStartWorkRequest = create(
  {
    ...defaultValue,
    requestTypeCode: CODE.EarlyStartWork,
    startDate: '2018-06-18',
    startTime: null,
    remarks: 'remarks',
    approver01Name: 'Approver',
    isForReapply: false,
  },
  9 * 60 // default endTime
);

// TODO: 振替・代休など適宜追加する予定

export default defaultValues;
