import * as yup from 'yup'; // for everything

import msg from '../../../../commons/languages';

import { SUBSTITUTE_LEAVE_TYPE } from '../../../../domain/models/attendance/SubstituteLeaveType';

export default () =>
  yup.object().shape({
    startDate: yup.string().nullable().required(msg().Common_Err_Required),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    startTime: yup.mixed().required(msg().Common_Err_Required),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    endTime: yup.mixed().required(msg().Common_Err_Required),
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
