import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  OvertimeWorkRequest,
} from '@attendance/domain/models/AttDailyRequest/OvertimeWorkRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

export const defaultValues: OvertimeWorkRequest = create(
  {
    ...defaultValue,
    requestTypeCode: CODE.OvertimeWork,
    startDate: '2018-06-18',
    endTime: null,
    remarks: 'remarks',
    approver01Name: 'Approver',
    isForReapply: false,
  },
  18 * 60 // default startTime
);

export default defaultValues;
