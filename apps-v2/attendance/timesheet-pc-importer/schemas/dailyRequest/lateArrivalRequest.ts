import schema from '../schema';

import msg from '@commons/languages';

import { MAX_LENGTH_REASON } from '@attendance/domain/models/importer/DailyRequest/LateArrivalRequest';

import needStartEndTime from '../methods/needStartEndTime';
import { DailyRecordViewModel } from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

const appliedLateArrivalRequest = schema.mixed().when({
  is: true,
  then: needStartEndTime(() => msg().Att_Lbl_LateArrival),
});

const lateArrivalRequestReasonText = schema
  .mixed()
  .when('appliedLateArrivalRequest', {
    is: true,
    then: schema.string().nullable().max(MAX_LENGTH_REASON),
  });

const lateArrivalRequestReasonCode = schema
  .mixed()
  .when('appliedLateArrivalRequest', {
    is: true,
    then: ($schema) =>
      $schema.when('lateArrivalRequestReasonText', {
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
  appliedLateArrivalRequest,
  lateArrivalRequestReasonText,
  lateArrivalRequestReasonCode,
} as { [key in keyof DailyRecordViewModel]: schema.AnyObjectSchema };
