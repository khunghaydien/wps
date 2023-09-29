import * as Yup from 'yup';

import { checkForInvalidDate } from './NewProjectForm';

export const isDatePeriodValid = (values) =>
  Yup.string()
    .nullable()
    .required('Common_Err_Required')
    .test(
      'is-date-valid',
      'Psa_Err_DateNotValid',
      function checkDatePeriodValidity() {
        const { plannedStartDate, plannedEndDate } = values;
        const startDate = new Date(plannedStartDate);
        const endDate = new Date(plannedEndDate);

        const isInvalidDatePeriod = startDate > endDate;

        // only check if there is end date
        if (plannedEndDate) {
          if (isInvalidDatePeriod || !plannedStartDate) {
            return false;
          }
        }

        return true;
      }
    )
    .test('is-date-valid', 'Psa_Lbl_InvalidDate', () =>
      checkForInvalidDate(values.plannedStartDate)
    );

const newActivityFormSchema = Yup.lazy((values) => {
  return Yup.object().shape({
    title: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .max(80, 'Common_Err_Max')
      .trim('Common_Err_Required'),
    code: Yup.string().when('useExistingJobCode', {
      is: true,
      then: Yup.string(),
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
      otherwise: Yup.string(),
    }),
    plannedStartDate: isDatePeriodValid(values),
    plannedEndDate: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .test('is-date-valid', 'Psa_Lbl_InvalidDate', () =>
        checkForInvalidDate(values.plannedEndDate)
      ),
  });
});

export default newActivityFormSchema;
