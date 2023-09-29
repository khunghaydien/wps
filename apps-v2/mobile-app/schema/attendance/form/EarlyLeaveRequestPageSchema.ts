import * as yup from 'yup'; // for everything

import msg from '../../../../commons/languages';

const reasonValidator = () =>
  yup.mixed().when(['useEarlyLeaveReason'], {
    is: (useEarlyLeaveReason) => {
      if (useEarlyLeaveReason) {
        return true;
      } else {
        return false;
      }
    },
    then: yup.string().nullable(),
    otherwise: yup.string().nullable().required(msg().Common_Err_Required),
  });
const reasonIdValidator = () =>
  yup.mixed().when(['useEarlyLeaveReason'], {
    is: (useEarlyLeaveReason) => {
      if (useEarlyLeaveReason) {
        return false;
      } else {
        return true;
      }
    },
    then: yup.string().nullable(),
    otherwise: yup.string().nullable().required(msg().Common_Err_Required),
  });

export default () =>
  yup.object().shape({
    startDate: yup.string().nullable().required(msg().Common_Err_Required),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    startTime: yup.number().nullable().required(msg().Common_Err_Required),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    endTime: yup.number().nullable().required(msg().Common_Err_Required),
    reason: reasonValidator(),
    reasonId: reasonIdValidator(),
    remarks: yup.string().nullable(),
  });
