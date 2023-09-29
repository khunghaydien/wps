import { defaultValue } from '../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  OvertimeWorkRequest,
} from '../../../../../../domain/models/attendance/AttDailyRequest/OvertimeWorkRequest';
import { CODE } from '../../../../../../domain/models/attendance/AttDailyRequestType';

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
