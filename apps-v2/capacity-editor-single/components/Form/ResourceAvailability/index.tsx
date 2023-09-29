import React from 'react';

import {
  AVAILABILITY_STATUS,
  FORM_FIELD,
  WORK_SCHEME_WEEKDAYS,
} from '../../../constants/formField';

import SelectField from '@apps/commons/components/fields/SelectField';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import './index.scss';

export const FROM_ROOT = 'ts-psa__capacity-editor-single__form';
export const ROOT = 'ts-psa__capacity-editor-single__resource';

const ResourceAvailability = (props) => {
  const {
    workSchemeList,
    workArrangementList,
    availabilityItem,
    values,
    errors,
    touched,
  } = props;

  const statusOptions = Object.values(AVAILABILITY_STATUS).map((value) => {
    if (value !== AVAILABILITY_STATUS.RETIRED) {
      return {
        value,
        text: msg()[`Psa_Lbl_AvailabilityStatus${value ?? 'None'}`],
        disabled: false,
      };
    } else {
      return {
        value,
        text: msg()[`Psa_Lbl_AvailabilityStatus${value ?? 'None'}`],
        disabled: true,
      };
    }
  });

  const workSchemeOptions = [
    {
      value: null,
      text: '-',
      disabled: false,
    },
    ...workSchemeList.map((workScheme) => {
      return {
        value: workScheme.code,
        text: workScheme.code + ' - ' + workScheme.name,
        disabled: false,
      };
    }),
  ];

  const workArrangementOptions = [
    {
      value: null,
      text: '-',
      disabled: false,
    },
    ...workArrangementList.map((workArrangement) => {
      return {
        value: workArrangement.code,
        text: workArrangement.code + ' - ' + workArrangement.name,
        disabled: false,
      };
    }),
  ];

  const calculateAvailableTime = () => {
    const result =
      values.capacity -
      values.workArrangementTime1 -
      values.workArrangementTime2 -
      values.workArrangementTime3 -
      availabilityItem.nonProjectBookingTime -
      values.nonProjectBookingTimeRM -
      availabilityItem.unavailableTime;

    return isNaN(result) ? null : result;
  };

  const isRetiredStatus = values.status === AVAILABILITY_STATUS.RETIRED;

  return (
    <div>
      <div className={`${FROM_ROOT}__title`}>
        {msg().Psa_Lbl_CapacityEditorSingleForm}
      </div>
      <section className={ROOT}>
        {/* Employee Name field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityEmployeeName}
          testId={`${ROOT}__availability__employee-name`}
        >
          <div>{availabilityItem.employeeName}</div>
        </FormField>
        {/* Date field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityDate}
          testId={`${ROOT}__availability__date`}
        >
          <div>
            {DateUtil.format(availabilityItem.capacityDate, 'YYYY-MM-DD')}
          </div>
        </FormField>
        {/* Status field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityStatus}
          testId={`${ROOT}__availability__status`}
        >
          <SelectField
            onChange={(e) => {
              if (
                e.target.value === AVAILABILITY_STATUS.INACTIVE ||
                e.target.value === AVAILABILITY_STATUS.ABSENCE
              ) {
                props.setFieldValue(FORM_FIELD.CAPACITY, '0');
              }
              props.setFieldValue(FORM_FIELD.STATUS, e.target.value);
            }}
            options={statusOptions}
            value={values.status || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Work Scheme field */}
        <FormField
          title={`${msg().Psa_Lbl_AvailabilityWorkScheme}`}
          testId={`${ROOT}__availability__work-scheme-code`}
        >
          <SelectField
            onChange={(e) => {
              props.setFieldValue(FORM_FIELD.WORK_SCHEME_CODE, e.target.value);

              const dayOfWeek = new Date(
                DateUtil.format(availabilityItem.capacityDate, 'YYYY-MM-DD')
              ).getDay();
              const targetDay = WORK_SCHEME_WEEKDAYS[dayOfWeek];
              const workingDays = workSchemeList.find(
                (obj) => obj.code === e.target.value
              );

              if (workingDays[targetDay]) {
                props.setFieldValue(
                  FORM_FIELD.CAPACITY,
                  workSchemeList.find((obj) => obj.code === e.target.value)
                    ?.workTimePerDay
                );
              } else {
                props.setFieldValue(FORM_FIELD.CAPACITY, '0');
              }
            }}
            options={workSchemeOptions}
            value={values.workSchemeCode || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Available Time field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityAvailableTime}
          testId={`${ROOT}__availability__available-time`}
        >
          <div>{calculateAvailableTime()}</div>
        </FormField>
        {/* Contractual Working Time field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityContractualWorkingTime}
          testId={`${ROOT}__availability__contractual-working-time`}
          error={errors.capacity}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.capacity}
        >
          <input
            className={'ts-text-field slds-input'}
            type="number"
            onChange={(e) =>
              props.setFieldValue(FORM_FIELD.CAPACITY, e.target.value ?? null)
            }
            value={values.capacity || ''}
            disabled={
              values.status === AVAILABILITY_STATUS.INACTIVE ||
              values.status === AVAILABILITY_STATUS.ABSENCE ||
              isRetiredStatus
            }
          />
        </FormField>
        {/* Working Arrangement 1 field */}
        <FormField
          title={`${msg().Psa_Lbl_AvailabilityWorkArrangement1}`}
          testId={`${ROOT}__availability__work-arrangement1`}
        >
          <SelectField
            onChange={(e) => {
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_CODE_1,
                e.target.value
              );
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_TIME_1,
                workArrangementList.find((obj) => obj.code === e.target.value)
                  ?.workTime
              );
            }}
            options={workArrangementOptions}
            value={values.workArrangementCode1}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Working Arrangement Time 1 field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityWorkArrangementTime1}
          testId={`${ROOT}__availability__contractual-working-time1`}
          error={errors.workArrangementTime1}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.workArrangementTime1}
        >
          <input
            className={'ts-text-field slds-input'}
            type="number"
            onChange={(e) =>
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_TIME_1,
                e.target.value ?? null
              )
            }
            value={values.workArrangementTime1 || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Working Arrangement Code 2 field */}
        <FormField
          title={`${msg().Psa_Lbl_AvailabilityWorkArrangement2}`}
          testId={`${ROOT}__availability__work-arrangement2`}
        >
          <SelectField
            onChange={(e) => {
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_CODE_2,
                e.target.value
              );
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_TIME_2,
                workArrangementList.find((obj) => obj.code === e.target.value)
                  ?.workTime
              );
            }}
            options={workArrangementOptions}
            value={values.workArrangementCode2 || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Working Arrangement Time 2 field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityWorkArrangementTime2}
          testId={`${ROOT}__availability__contractual-working-time2`}
          error={errors.workArrangementTime2}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.workArrangementTime2}
        >
          <input
            className={'ts-text-field slds-input'}
            type="number"
            onChange={(e) =>
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_TIME_2,
                e.target.value
              )
            }
            value={values.workArrangementTime2 || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Working Arrangement Code 3 field */}
        <FormField
          title={`${msg().Psa_Lbl_AvailabilityWorkArrangement3}`}
          testId={`${ROOT}__availability__work-arrangement3`}
        >
          <SelectField
            onChange={(e) => {
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_CODE_3,
                e.target.value
              );
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_TIME_3,
                workArrangementList.find((obj) => obj.code === e.target.value)
                  ?.workTime
              );
            }}
            options={workArrangementOptions}
            value={values.workArrangementCode3 || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Working Arrangement Time 3 field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityWorkArrangementTime3}
          testId={`${ROOT}__availability__contractual-working-time3`}
          error={errors.workArrangementTime3}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.workArrangementTime3}
        >
          <input
            className={'ts-text-field slds-input'}
            type="number"
            onChange={(e) =>
              props.setFieldValue(
                FORM_FIELD.WORK_ARRANGEMENT_TIME_3,
                e.target.value ?? null
              )
            }
            value={values.workArrangementTime3 || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* No Project Booking Time Member field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityNonProjectBookingTime}
          testId={`${ROOT}__availability__resource-no-project-booking-time`}
        >
          <div>{availabilityItem.nonProjectBookingTime || ''}</div>
        </FormField>
        {/* Member Comment field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityMemberComment}
          testId={`${ROOT}__availability__resource-member-comment`}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {availabilityItem.memberComment || ''}
          </div>
        </FormField>
        {/* No Project Booking Time RM field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityNonProjectBookingTimeRM}
          testId={`${ROOT}__availability__resource-no-project-booking-time-rm`}
          error={errors.nonProjectBookingTimeRM}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.nonProjectBookingTimeRM}
        >
          <input
            className={'ts-text-field slds-input'}
            type="number"
            onChange={(e) =>
              props.setFieldValue(
                FORM_FIELD.NON_PROJECT_BOOKING_TIME_PM,
                e.target.value ?? null
              )
            }
            value={values.nonProjectBookingTimeRM || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* RM Comment field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityRMComment}
          testId={`${ROOT}__availability__resource-rm-comment`}
          error={errors.RMComment}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.RMComment}
        >
          <TextAreaField
            onChange={(e) => {
              props.setFieldValue(FORM_FIELD.RM_COMMENT, e.target.value);
            }}
            value={values.RMComment || ''}
            disabled={isRetiredStatus}
          />
        </FormField>
        {/* Unavailable Time field */}
        <FormField
          title={msg().Psa_Lbl_AvailabilityUnavailableTime}
          testId={`${ROOT}__availability__resource-unavailable-time`}
          error={errors.unavailableTime}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.unavailableTime}
        >
          <div>{availabilityItem.unavailableTime}</div>
        </FormField>
      </section>
    </div>
  );
};

export default ResourceAvailability;
