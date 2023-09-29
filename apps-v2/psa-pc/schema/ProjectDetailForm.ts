import moment from 'moment';
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
  ).test(
    'is-planning-status-valid',
    'Psa_Err_PlanningStatusNotValid',
    function checkStatusAgainstDate(){
      const startDate = new Date(values.startDate);
      const today = new Date();
      const isStartDateEarlierThanToday = startDate <= today;
      const currentStatus = values.status;
      if (currentStatus === 'Planning' && isStartDateEarlierThanToday) {
        return false;
      }
      return true;
    }
  );

export const isDateBetweenStartEndDate = (values) => {
  return Yup.string().test(
    'is-first-date-between-startDate-endDate',
    'Psa_Err_DateNotBetweenStartEndDate',
    function checkDate() {
      const startDate = moment(values.startDate, 'YYYY-MM-DD');
      const endDate = moment(values.endDate, 'YYYY-MM-DD');
      const firstCheckDate = moment(values.firstCheckDate, 'YYYY-MM-DD');
      const isDateBetween =
        firstCheckDate.isBetween(startDate, endDate) ||
        firstCheckDate.isSame(startDate) ||
        firstCheckDate.isSame(endDate);
      if (isDateBetween) {
        return true;
      }
      return false;
    }
  );
};

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
        .trim('Common_Err_Required'),
      otherwise: Yup.string().nullable(),
    }),
    description: Yup.string().nullable().max(1024, 'Common_Err_Max'),
    pmBaseId: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .trim('Common_Err_Required'),
    groupId: Yup.string().nullable(),
    opportunityId: Yup.string().nullable(),
    workTimePerDay: Yup.number()
      .min(60, 'Psa_Err_MoreThanZero')
      .max(720, 'Psa_Err_MaxWorkHoursPerDay')
      .required('Common_Err_Required'),
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
    useExistingJobCode: Yup.boolean(),
    ...getExtendedItemsValidators(values),
  });
});

export default newProjectFormSchema;
