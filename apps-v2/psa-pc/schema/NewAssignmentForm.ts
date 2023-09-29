import * as Yup from 'yup';

export const isDatePeriodValid = (values) =>
  Yup.string()
    .nullable()
    .test(
      'is-date-valid',
      'Psa_Err_DateNotValid',
      function checkDatePeriodValidity() {
        const { startDate, endDate } = values;
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);

        const isInvalidDatePeriod = formattedStartDate > formattedEndDate;

        if (isInvalidDatePeriod || !startDate || !endDate) {
          return false;
        }

        return true;
      }
    );

const newAssignmentFormSchema = Yup.lazy((values) => {
  return Yup.object().shape({
    role: Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .max(20, 'Common_Err_Max')
      .trim('Common_Err_Required'),
    description: Yup.string().nullable().max(1024, 'Common_Err_Max'),
    numOfWorkDays: Yup.number().max(365, 'Psa_Err_WorkDays'),
    workTimePerDay: Yup.number().max(1440, 'Psa_Err_WorkHoursPerDay'),
    assigneeBaseId: Yup.string().nullable().required('Common_Err_Required'),
    startDate: isDatePeriodValid(values),
    endDate: Yup.string().nullable(),
  });
});

export default newAssignmentFormSchema;
