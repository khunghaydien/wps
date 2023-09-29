import * as Yup from 'yup';

import { AVAILABILITY_STATUS, FORM_FIELD } from '../constants/formField';

import msg from '@apps/commons/languages';

export const ERROR_LABEL_OBJECT = {
  [FORM_FIELD.CAPACITY]: msg().Psa_Lbl_AvailabilityContractualWorkingTime,
  [FORM_FIELD.WORK_ARRANGEMENT_TIME_1]:
    msg().Psa_Lbl_AvailabilityWorkArrangementTime1,
  [FORM_FIELD.WORK_ARRANGEMENT_TIME_2]:
    msg().Psa_Lbl_AvailabilityWorkArrangementTime2,
  [FORM_FIELD.WORK_ARRANGEMENT_TIME_3]:
    msg().Psa_Lbl_AvailabilityWorkArrangementTime3,
  [FORM_FIELD.NON_PROJECT_BOOKING_TIME_PM]:
    msg().Psa_Lbl_AvailabilityNonProjectBookingTimeRM,
  [FORM_FIELD.RM_COMMENT]: msg().Psa_Lbl_AvailabilityRMComment,
};

export const singleCapacityFromSchema = Yup.lazy(() => {
  return Yup.object().shape({
    [FORM_FIELD.CAPACITY]: Yup.number()
      .nullable()
      .min(0, 'Psa_Err_MoreThanZero')
      .max(720, 'Psa_Err_MaxWorkMinutesPerDay')
      .test(
        'is-whole-number',
        'Time must be a whole number',
        (value) =>
          value === null ||
          value === undefined ||
          (Number.isInteger(value) && !value.toString().includes('.'))
      )
      .test(
        'is-capacity-zero-as-per-status',
        'Psa_Err_ContractualWorkingTimeMustBeZero',
        function (value) {
          if (
            (this.parent[FORM_FIELD.STATUS] === AVAILABILITY_STATUS.INACTIVE ||
              this.parent[FORM_FIELD.STATUS] === AVAILABILITY_STATUS.ABSENCE) &&
            value !== 0
          ) {
            return false;
          }
          return true;
        }
      ),
    [FORM_FIELD.WORK_ARRANGEMENT_TIME_1]: Yup.number()
      .nullable()
      .min(-720, 'Psa_Err_MoreThanMinus720Minutes')
      .max(720, 'Psa_Err_MaxWorkMinutesPerDay')
      .test(
        'is-whole-number',
        'Time must be a whole number',
        (value) =>
          value === null ||
          value === undefined ||
          (Number.isInteger(value) && !value.toString().includes('.'))
      ),
    [FORM_FIELD.WORK_ARRANGEMENT_TIME_2]: Yup.number()
      .nullable()
      .min(-720, 'Psa_Err_MoreThanMinus720Minutes')
      .max(720, 'Psa_Err_MaxWorkMinutesPerDay')
      .test(
        'is-whole-number',
        'Time must be a whole number',
        (value) =>
          value === null ||
          value === undefined ||
          (Number.isInteger(value) && !value.toString().includes('.'))
      ),
    [FORM_FIELD.WORK_ARRANGEMENT_TIME_3]: Yup.number()
      .nullable()
      .min(-720, 'Psa_Err_MoreThanMinus720Minutes')
      .max(720, 'Psa_Err_MaxWorkMinutesPerDay')
      .test(
        'is-whole-number',
        'Time must be a whole number',
        (value) =>
          value === null ||
          value === undefined ||
          (Number.isInteger(value) && !value.toString().includes('.'))
      ),
    opportunityId: Yup.string().nullable(),
    [FORM_FIELD.NON_PROJECT_BOOKING_TIME_PM]: Yup.number()
      .nullable()
      .min(0, 'Psa_Err_MoreThanZero')
      .max(720, 'Psa_Err_MaxWorkMinutesPerDay')
      .test(
        'is-whole-number',
        'Time must be a whole number',
        (value) =>
          value === null ||
          value === undefined ||
          (Number.isInteger(value) && !value.toString().includes('.'))
      ),
    [FORM_FIELD.RM_COMMENT]: Yup.string()
      .nullable()
      .max(1024, 'Common_Err_Max'),
  });
});

export default singleCapacityFromSchema;
