import React, { useEffect, useState } from 'react';

import SelectField from '@apps/commons/components/fields/SelectField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';

import { CategoryType } from '@apps/domain/models/psa/ExtendedItem';
import { PROGRESS_FREQUENCY, WEEK_DAY } from '@apps/domain/models/psa/Project';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';

import { Props as CreateProps } from '@psa/components/Dialog/NewProjectForm/index';
import { Props } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import './index.scss';

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__notificationSettings`;

const NotificationSettings = (props: Props | CreateProps) => {
  // @ts-ignore
  const { errors, touched, refArray, values } = props;

  const [
    isProgressCheckFrequencyDisabled,
    setProgressCheckFrequencyEnableStatus,
  ] = useState(true);

  useEffect(() => {
    if (!props.values.progressCheckFrequency) {
      setProgressCheckFrequencyEnableStatus(false);
    } else {
      setProgressCheckFrequencyEnableStatus(true);
    }
  }, [props.isLoading]);

  let progressFrequencyOptions = props.createProject
    ? Object.keys(PROGRESS_FREQUENCY).map((key) => {
        return {
          value: key,
          text: msg()[`Psa_Lbl_ProgressFrequency${key}`],
        };
      })
    : // @ts-ignore
      props.selectedProject &&
      Object.keys(PROGRESS_FREQUENCY).map((key) => {
        return {
          value: key,
          text: msg()[`Psa_Lbl_ProgressFrequency${key}`],
        };
      });
  let weekDayOptions = Object.keys(WEEK_DAY).map((key) => {
    return {
      value: key,
      text: msg()[`Com_Lbl_${key}`],
    };
  });
  let dateOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1 + '',
    text: i + 1 + '',
  }));

  progressFrequencyOptions = [
    { value: '', text: '' },
    ...progressFrequencyOptions,
  ];
  weekDayOptions = [{ value: '', text: '' }, ...weekDayOptions];
  dateOptions = [{ value: '', text: '' }, ...dateOptions];

  // Extended items
  const [renderedExtendedItem, setRenderedExtendedItem] = useState(<div></div>);
  const formFieldGenerator = (extendedItem: PsaExtendedItem) => {
    let result;
    switch (extendedItem.inputType) {
      case 'Text':
        result = (
          <input
            disabled={extendedItem.readOnly}
            className="ts-text-field slds-input"
            type="text"
            onChange={(e) => {
              props.setFieldValue(`${extendedItem.id}`, e.target.value);
            }}
            value={values[extendedItem.id]}
          />
        );
        break;
      case 'Date':
        result = (
          <PsaDateField
            disabled={extendedItem.readOnly}
            placeholder={msg().Admin_Lbl_ExtendedItemDate}
            value={DateUtil.format(values[extendedItem.id], 'YYYY-MM-DD')}
            onChange={(eiDate) => {
              props.setFieldValue(`${extendedItem.id}`, eiDate);
            }}
          />
        );
        break;
      case 'Picklist':
        result = (
          <SelectField
            disabled={extendedItem.readOnly}
            className={`${ROOT}__ei-select`}
            options={
              extendedItem.picklistValue &&
              generatePicklistOptions(
                extendedItem.picklistLabel,
                extendedItem.picklistValue
                  .split('\\n')
                  .map((e) => e.trim())
                  .join('\\n')
              )
            }
            onChange={(e) => {
              props.setFieldValue(`${extendedItem.id}`, e.target.value);
            }}
            value={values[extendedItem.id]}
          />
        );
        break;
    }
    return result;
  };

  useEffect(() => {
    if (
      props.extendedItemConfigList &&
      props.extendedItemConfigList.length > 0
    ) {
      const extendedItems = (
        <div className={`${ROOT}__extended-item-container`}>
          {props.extendedItemConfigList &&
            props.extendedItemConfigList.map(
              (eItem) =>
                eItem.enabled &&
                eItem.categoryType ===
                  CategoryType.ProjectNotificationSetting && (
                  <FormField
                    title={eItem.name}
                    testId={`${ROOT}__eI`}
                    isRequired={eItem.required}
                    error={errors[eItem.id]}
                    errorTextClassName={`${ROOT}__errText`}
                    isTouched={touched[eItem.id]}
                    tooltip={eItem.description}
                  >
                    {formFieldGenerator(eItem)}
                  </FormField>
                )
            )}
        </div>
      );
      setRenderedExtendedItem(extendedItems);
    }
  }, [props.extendedItemConfigList, values, touched, errors]);
  // end of Extended items

  return (
    <>
      <div className={`${FORM_ROOT}__title`}>
        {msg().Psa_Lbl_FormNotificationSettings}
      </div>
      <section ref={refArray[4]} className={ROOT}>
        {props.enableProgressCheck && (
          <>
            <FormField
              title={msg().Psa_Lbl_ProgressFrequency}
              className={`${ROOT}__progress-frequency`}
              testId={`${ROOT}__progress-frequency`}
            >
              <SelectField
                disabled={
                  isProgressCheckFrequencyDisabled &&
                  (values.status !== 'Planning' ||
                    // @ts-ignore
                    !!props.hasInProgressOrCompletedActivity)
                }
                onChange={(e) => {
                  props.setFieldValue('progressCheckFrequency', e.target.value);
                  if (e.target.value === PROGRESS_FREQUENCY.Weekly) {
                    props.setFieldValue('pushNotificationDate', '');
                  } else if (e.target.value === PROGRESS_FREQUENCY.Monthly) {
                    props.setFieldValue('pushNotificationDay', '');
                  } else if (e.target.value === '') {
                    props.setFieldValue('pushNotificationDate', '');
                    props.setFieldValue('pushNotificationDay', '');
                  }
                }}
                options={progressFrequencyOptions}
                value={values.progressCheckFrequency}
              />
            </FormField>
            <FormField
              title={msg().Psa_Lbl_PushNotificationDate}
              className={`${ROOT}__push-notification-date`}
              testId={`${ROOT}__push-notification-date`}
            >
              <SelectField
                disabled={
                  values.progressCheckFrequency === null ||
                  values.progressCheckFrequency === '' ||
                  values.progressCheckFrequency === 'Weekly' ||
                  (values.status !== 'Planning' &&
                    // @ts-ignore
                    !!props.hasInProgressOrCompletedActivity)
                }
                onChange={(e) => {
                  props.setFieldValue('pushNotificationDate', e.target.value);
                }}
                options={dateOptions}
                value={values.pushNotificationDate}
              />
            </FormField>
            <FormField
              title={msg().Psa_Lbl_PushNotificationDay}
              className={`${ROOT}__push-notification-day`}
              testId={`${ROOT}__push-notification-day`}
            >
              <SelectField
                disabled={
                  values.progressCheckFrequency === null ||
                  values.progressCheckFrequency === '' ||
                  values.progressCheckFrequency === 'Monthly' ||
                  (values.status !== 'Planning' &&
                    // @ts-ignore
                    !!props.hasInProgressOrCompletedActivity)
                }
                onChange={(e) => {
                  props.setFieldValue('pushNotificationDay', e.target.value);
                }}
                options={weekDayOptions}
                value={values.pushNotificationDay}
              />
            </FormField>
          </>
        )}
        {renderedExtendedItem}
      </section>
    </>
  );
};

export default NotificationSettings;
