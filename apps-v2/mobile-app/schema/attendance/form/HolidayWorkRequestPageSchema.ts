import * as yup from 'yup'; // for everything

import msg from '../../../../commons/languages';

import { isUseStartTimeAndEndTime } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

const requiredWhenNotUsePattern = yup
  .mixed()
  .when(
    ['enabledPatternApply', 'patterns', 'patternCode', 'substituteLeaveType'],
    {
      is: (enabledPatternApply, patterns, patternCode, substituteLeaveType) =>
        isUseStartTimeAndEndTime({
          enabledPatternApply,
          substituteLeaveType,
          patterns,
          patternCode,
        }),
      // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
      then: ($schema) => $schema.required(msg().Common_Err_Required),
    }
  );

export default () =>
  yup.object().shape({
    startDate: yup.string().nullable().required(msg().Common_Err_Required),
    startTime: yup.mixed().concat(requiredWhenNotUsePattern),
    endTime: yup.mixed().concat(requiredWhenNotUsePattern),
    substituteLeaveType: yup.string().nullable(),
    substituteDate: yup
      .string()
      .nullable()
      .when('substituteLeaveType', {
        is: SUBSTITUTE_LEAVE_TYPE.Substitute,
        then: yup.string().required(msg().Common_Err_Required),
      }),
    remarks: yup.string().nullable(),
  });
