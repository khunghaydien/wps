import * as Yup from 'yup';

import { getExtendedItemsValidators } from '@apps/commons/utils/psa/ExtendedItemUtil';

import { checkForInvalidDate, isDatePeriodValid } from './NewProjectForm';

export const isStatusValid = (values) =>
  Yup.string().test(
    'is-status-valid',
    'Psa_Err_StatusNotValid',
    function checkStatusValidity() {
      const startDate = new Date(values.startDate);
      const today = new Date();
      const isStartDateEarlierThanToday = startDate <= today;
      const currentStatus = values.status;

      if (currentStatus === 'InProgress' && !isStartDateEarlierThanToday) {
        return false;
      }

      return true;
    }
  );

const newProjectFormSchema = Yup.lazy((values) => {
  return Yup.object().shape({
    code: Yup.string().when('useExistingJobCode', {
      is: true,
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .nullable()
        .required('Common_Err_Required')
        .max(18, 'Common_Err_Max')
        .trim('Common_Err_Required'),
    }),
    jobId: Yup.string().when('useExistingJobCode', {
      is: true,
      then: Yup.string()
        .nullable()
        .required('Common_Err_Required')
        .trim('Common_Err_Required'),
      otherwise: Yup.string(),
    }),
    description: Yup.string().nullable().max(1024, 'Common_Err_Max'),
    pmBaseId: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .trim('Common_Err_Required'),
    groupId: Yup.string().nullable(),
    workTimePerDay: Yup.number()
      .min(60, 'Psa_Err_MoreThanZero')
      .max(720, 'Psa_Err_MaxWorkHoursPerDay')
      .required('Common_Err_Required'),
    name: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .max(80, 'Common_Err_Max')
      .trim('Common_Err_Required'),
    status: isStatusValid(values),
    startDate: isDatePeriodValid(values),
    endDate: Yup.string()
      .nullable()
      .test('is-date-valid', 'Psa_Lbl_InvalidDate', () =>
        checkForInvalidDate(values.endDate)
      ),
    useExistingJobCode: Yup.boolean(),
    ...getExtendedItemsValidators(values),
  });
});

export default newProjectFormSchema;
