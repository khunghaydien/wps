import React, { useEffect, useState } from 'react';

import AmountField from '@apps/commons/components/fields/AmountField';
import SelectField from '@apps/commons/components/fields/SelectField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { CategoryType } from '@apps/domain/models/psa/ExtendedItem';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';

import { Props as CreateProps } from '@psa/components/Dialog/NewProjectForm/index';
import { Props } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import './index.scss';

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__planning-options`;

const PlanningOptions = (props: Props | CreateProps) => {
  // @ts-ignore
  const { refArray, values, errors, touched } = props;
  const isPermissionRead = props.permission === 'Read' && !props.createProject;
  const isEverythingElseDisabled =
    values.status !== 'Planning' && !props.createProject;
  const planningCycleOptions = [
    {
      value: 'Monthly',
      text: msg().Psa_Lbl_ProgressFrequencyMonthly,
      disabled: false,
    },
    {
      value: 'Weekly',
      text: msg().Psa_Lbl_ProgressFrequencyWeekly,
      disabled: false,
    },
  ];

  // Extended items
  const [renderedExtendedItem, setRenderedExtendedItem] = useState(<div></div>);
  const formFieldGenerator = (extendedItem: PsaExtendedItem) => {
    let result;
    switch (extendedItem.inputType) {
      case 'Text':
        result = (
          <input
            disabled={extendedItem.readOnly || isPermissionRead}
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
            disabled={extendedItem.readOnly || isPermissionRead}
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
            disabled={extendedItem.readOnly || isPermissionRead}
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
                eItem.categoryType === CategoryType.ProjectPlanningOptions && (
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
        {msg().Psa_Lbl_FormPlanningOptions}
      </div>
      <section ref={refArray[3]} className={ROOT}>
        <FormField
          title={msg().Psa_Lbl_WorkTimePerDay}
          isRequired
          error={errors.workTimePerDay}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.workTimePerDay}
          testId={`${ROOT}__work-hours`}
          tooltip={props.customHint.workHoursPerDay}
        >
          <AmountField
            disabled={isEverythingElseDisabled || isPermissionRead}
            onChange={(value) => {
              if (typeof value !== 'undefined') {
                const minutes = Number(value) * 60;
                props.setFieldValue('workTimePerDay', minutes);
              } else {
                props.setFieldValue('workTimePerDay', '');
              }
            }}
            value={
              values.workTimePerDay
                ? TimeUtil.toHours(values.workTimePerDay)
                : ''
            }
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_Calendar}
          className={`${ROOT}__calendar`}
          testId={`${ROOT}__calendar`}
          tooltip={props.customHint.calendar}
        >
          <SelectField
            disabled={isEverythingElseDisabled || isPermissionRead}
            className={`${ROOT}__calendar-contents`}
            options={props.calendarListOption}
            onChange={(e) => {
              props.setFieldValue('calendarId', e.target.value);
            }}
            value={values.calendarId}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_WorkingDays}
          className={`${ROOT}__workingdays`}
          testId={`${ROOT}__working-days`}
          tooltip={props.customHint.projectWorkingDays}
        >
          <div className={`${ROOT}__workingdays-contents`}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
              const workingDay = `workingDay${day.toUpperCase()}`;
              return (
                <label
                  className={`${ROOT}__workingdays-label`}
                  htmlFor={workingDay}
                  key={workingDay}
                >
                  <input
                    type="checkbox"
                    disabled={isEverythingElseDisabled || isPermissionRead}
                    id={workingDay}
                    className={`${ROOT}__workingdays-checkbox`}
                    onChange={() =>
                      props.setFieldValue(workingDay, !values[workingDay])
                    }
                    value={values[workingDay] || false}
                    checked={values[workingDay] || false}
                  />
                  <span
                    className={`${ROOT}__workingdays-text`}
                    style={{ marginLeft: props.createProject && '5px' }}
                  >
                    {msg()[`Com_Lbl_${day}`]}
                  </span>
                </label>
              );
            })}
          </div>
        </FormField>
        <FormField
          title={msg().Psa_Lbl_PlanningCycle}
          testId={`${ROOT}__planning-cycle`}
          tooltip={props.customHint.planningCycle}
        >
          <SelectField
            disabled={isEverythingElseDisabled || isPermissionRead}
            onChange={(e) => {
              props.setFieldValue('planningCycle', e.target.value);
            }}
            options={planningCycleOptions}
            value={values.planningCycle}
          />
        </FormField>
        {renderedExtendedItem}
      </section>
    </>
  );
};

export default PlanningOptions;
