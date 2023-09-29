import * as yup from 'yup'; // for everything

import msg from '../../../../commons/languages';

export default () =>
  yup.object().shape({
    startDate: yup.string().nullable().required(msg().Common_Err_Required),
    endDate: yup.string().nullable(),
    patternCode: yup.string().nullable().required(msg().Common_Err_Required),
    remarks: yup.string().nullable(),
  });
