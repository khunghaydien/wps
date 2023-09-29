import moment from 'moment';
import * as Yup from 'yup';

export const isDatePeriodValid = (values) => {
  const { isRescheduled } = values;
  const errorMsg = isRescheduled
    ? 'Psa_Err_RescheduledDateNotValid'
    : 'Psa_Err_CompletionDateNotValid';
  return Yup.string()
    .nullable()
    .required('Common_Err_Required')
    .test(
      'is-date-valid',
      'Psa_Lbl_InvalidDate',
      function checkForInvalidDate() {
        const isDateValid = moment(
          values.endDate,
          ['YYYY-MM-DD', 'YYYY/M/D', 'L', 'MM/DD/YYYY'],
          true
        ).isValid();
        return isDateValid;
      }
    )
    .test('is-date-valid', errorMsg, function checkDatePeriodValidity() {
      const today = new Date();
      const oldEndDate = new Date(values.oldEndDate);
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);

      // Validation for Reschedule End Date
      // Role start date & Today < End date < Booking Role End date
      if (isRescheduled) {
        const laterThanStartDate = endDate > startDate;
        const laterThanToday = endDate > today;
        const earlierThanOldEndDate = endDate < oldEndDate;

        if (!(laterThanStartDate && laterThanToday && earlierThanOldEndDate)) {
          return false;
        }

        // Validation for completion
        // Booking Role Start Date <= Actual End date <= Today
      } else if (!(endDate >= startDate && endDate <= today)) {
        return false;
      }

      return true;
    });
};

const roleEndDateFormSchema = Yup.lazy((values) => {
  return Yup.object().shape({
    endDate: isDatePeriodValid(values),
  });
});

export default roleEndDateFormSchema;
