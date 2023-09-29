import * as Yup from 'yup';

import { getExtendedItemsValidators } from '@apps/commons/utils/psa/ExtendedItemUtil';

import { checkForInvalidDate } from './NewProjectForm';

export const isDatePeriodValid = (values) =>
  Yup.string()
    .nullable()
    .required('Common_Err_Required')
    .test(
      'is-date-valid',
      'Psa_Err_DateNotValid',
      function checkDatePeriodValidity() {
        const { startDate, endDate } = values;
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);

        const isInvalidDatePeriod = formattedStartDate > formattedEndDate;

        if (startDate && endDate) {
          if (isInvalidDatePeriod || !startDate || !endDate) {
            return false;
          }
          return true;
        } else {
          return true;
        }
      }
    )
    .test('is-date-valid', 'Psa_Lbl_InvalidDate', () =>
      checkForInvalidDate(values.startDate)
    );

const checkRequiredTimeValidity = (values) =>
  function () {
    const { requiredTime, maxWorkingTime } = values;

    if (maxWorkingTime) {
      return requiredTime <= maxWorkingTime;
    }

    return true;
  };
const checkRequiredTimePositiveValue = (values) =>
  function () {
    const { requiredTime } = values;

    if (requiredTime <= 0) {
      return false;
    }

    return true;
  };

const checkAssignmentDueDateValue = (values) =>
  Yup.string()
    .nullable()
    .required('Common_Err_Required')
    .test(
      'is-assignment-due-date-valid',
      'Psa_Err_InvalidAssignmentDueDate',
      () => {
        const { startDate, assignmentDueDate } = values;
        const formattedStartDate = new Date(startDate);
        const formattedAssignmentDueDate = new Date(assignmentDueDate);
        if (startDate)
          return (
            startDate &&
            assignmentDueDate &&
            formattedAssignmentDueDate <= formattedStartDate
          );
        else {
          return true;
        }
      }
    );

const newRoleFormSchema = Yup.lazy((values) => {
  return Yup.object().shape({
    roleTitle: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .max(80, 'Common_Err_Max')
      .trim('Common_Err_Required'),
    skills: Yup.array().of(Yup.object()),
    jobGrades: Yup.array().of(Yup.string().nullable()),
    startDate: isDatePeriodValid(values),
    endDate: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .test('is-date-valid', 'Psa_Lbl_InvalidDate', () =>
        checkForInvalidDate(values.endDate)
      ),
    assignmentDueDate: checkAssignmentDueDateValue(values),
    requiredTime: Yup.number()
      .required('Common_Err_Required')
      .typeError('Common_Err_TypeNumber')
      .test(
        'is-required-hours-valid',
        'Psa_Err_RequiredTimeMoreThanMax',
        checkRequiredTimeValidity(values)
      )
      .test(
        'is-required-hours-valid',
        'Psa_Err_RequiredTimeMustBePositive',
        checkRequiredTimePositiveValue(values)
      ),
    remarks: Yup.string().nullable().max(1000, 'Common_Err_Max'),
    groupId: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .trim('Common_Err_Required'),
    ...getExtendedItemsValidators(values),
  });
});

export default newRoleFormSchema;
