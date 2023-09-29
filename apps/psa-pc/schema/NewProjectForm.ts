import moment from 'moment';
import * as Yup from 'yup';

import { getExtendedItemsValidators } from '@apps/commons/utils/psa/ExtendedItemUtil';

export const checkForInvalidDate = (date) => {
  const isDateValid = moment(
    date,
    ['YYYY-MM-DD', 'YYYY/M/D', 'L', 'MM/DD/YYYY'],
    true
  ).isValid();
  return isDateValid;
};

export const isDatePeriodValid = (values) =>
  Yup.string()
    .nullable()
    .required('Common_Err_Required')
    .test(
      'is-date-valid',
      'Psa_Err_DateNotValid',
      function checkDatePeriodValidity() {
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);

        if (startDate > endDate) {
          return false;
        }

        return true;
      }
    )
    .test('is-date-valid', 'Psa_Lbl_InvalidDate', () =>
      checkForInvalidDate(values.startDate)
    );

const newProjectFormSchema = Yup.lazy((values) => {
  return Yup.object().shape({
    code: Yup.string().when('useExistingJobCode', {
      is: true,
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .nullable()
        .required('Common_Err_Required')
        .max(30, 'Common_Err_Max')
        .trim('Common_Err_Required'),
    }),
    jobId: Yup.string().when('useExistingJobCode', {
      is: true,
      then: Yup.string()
        .nullable()
        .required('Common_Err_Required')
        .max(18, 'Common_Err_Max')
        .trim('Common_Err_Required'),
      otherwise: Yup.string().nullable(),
    }),
    pmBaseId: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .trim('Common_Err_Required'),
    groupId: Yup.string().nullable().max(1000, 'Common_Err_Max'),
    name: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .max(80, 'Common_Err_Max')
      .trim('Common_Err_Required'),
    startDate: isDatePeriodValid(values),
    endDate: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .test('is-date-valid', 'Psa_Lbl_InvalidDate', () =>
        checkForInvalidDate(values.endDate)
      ),
    ...getExtendedItemsValidators(values),
  });
});

export default newProjectFormSchema;
