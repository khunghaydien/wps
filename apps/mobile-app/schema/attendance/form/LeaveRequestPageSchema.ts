import * as yup from 'yup'; // for everything

import msg from '../../../../commons/languages';

import { LEAVE_RANGE } from '../../../../domain/models/attendance/LeaveRange';

export default () =>
  yup.object().shape({
    leaveCode: yup.string().nullable().required(msg().Common_Err_Required),
    leaveRange: yup
      .string()
      .nullable()
      .required()
      .oneOf(Object.values(LEAVE_RANGE)),
    startDate: yup.string().nullable().required(msg().Common_Err_Required),
    endDate: yup
      .string()
      .nullable()
      .when('leaveRange', {
        is: LEAVE_RANGE.Day,
        then: yup.string().nullable().required(msg().Common_Err_Required),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.Time,
        then: yup.string().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.AM,
        then: yup.string().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.PM,
        then: yup.string().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.Half,
        then: yup.string().nullable(),
      }),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    startTime: yup
      .number()
      .nullable()
      .when('leaveRange', {
        is: LEAVE_RANGE.Day,
        then: yup.number().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.Time,
        then: yup.number().nullable().required(msg().Common_Err_Required),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.AM,
        then: yup.number().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.PM,
        then: yup.number().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.Half,
        then: yup.number().nullable(),
      }),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    endTime: yup
      .number()
      .nullable()
      .when('leaveRange', {
        is: LEAVE_RANGE.Day,
        then: yup.number().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.Time,
        then: yup.number().nullable().required(msg().Common_Err_Required),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.AM,
        then: yup.number().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.PM,
        then: yup.number().nullable(),
      })
      .when('leaveRange', {
        is: LEAVE_RANGE.Half,
        then: yup.number().nullable(),
      }),
    remarks: yup.string().nullable(),
    reason: yup
      .string()
      .nullable()
      .when('requireReason', {
        is: true,
        then: yup.string().nullable().required(msg().Common_Err_Required),
      }),
    requireReason: yup.boolean(),
  });
