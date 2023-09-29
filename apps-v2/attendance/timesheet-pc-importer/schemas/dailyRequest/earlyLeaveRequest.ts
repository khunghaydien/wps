import schema from '../schema';

import msg from '@commons/languages';

import { MAX_LENGTH_REASON } from '@attendance/domain/models/importer/DailyRequest/EarlyLeaveRequest';

import needStartEndTime from '../methods/needStartEndTime';
import { DailyRecordViewModel } from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

const appliedEarlyLeaveRequest = schema.mixed().when({
  is: true,
  then: needStartEndTime(() => msg().Att_Lbl_EarlyLeave),
});

const earlyLeaveRequestReasonText = schema
  .mixed()
  .when('appliedEarlyLeaveRequest', {
    is: true,
    then: schema.string().nullable().max(MAX_LENGTH_REASON),
  });

const earlyLeaveRequestReasonCode = schema
  .mixed()
  .when('appliedEarlyLeaveRequest', {
    is: true,
    then: ($schema) =>
      $schema.when('earlyLeaveRequestReasonText', {
        is: (value) => !value,
        then: schema.mixed().test({
          name: 'invalidReason',
          test: (value) => !!value,
          message: msg().Att_Err_InvalidReason,
        }),
        otherwise: schema.string().nullable(),
      }),
  });

export default {
  appliedEarlyLeaveRequest,
  earlyLeaveRequestReasonText,
  earlyLeaveRequestReasonCode,
} as { [key in keyof DailyRecordViewModel]: schema.AnyObjectSchema };
