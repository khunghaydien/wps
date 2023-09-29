import * as yup from 'yup'; // for everything

import msg from '../../../../commons/languages';

export default () =>
  yup.object().shape({
    startDate: yup.string().nullable().required(msg().Common_Err_Required),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    startTime: yup.number().nullable().required(msg().Common_Err_Required),
    // NOTE: 数値以外が入力されることはないので数値についてのバリデーションメッセージはなし
    endTime: yup.number().nullable().required(msg().Common_Err_Required),
    remarks: yup.string().nullable(),
  });
