import React, { useEffect, useState } from 'react';

import SelectField from '@apps/commons/components/fields/SelectField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';

import { CategoryType } from '@apps/domain/models/psa/ExtendedItem';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';

import { Props as CreateProps } from '@psa/components/Dialog/NewProjectForm/index';
import { Props } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import './index.scss';

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__financials`;

const Financials = (props: Props | CreateProps) => {
  // @ts-ignore
  const { refArray, values, errors, touched } = props;

  const contractTypeOptions = [
    {
      value: 'TnM',
      text: msg().Psa_Lbl_TimeAndMaterial,
      disabled: false,
    },
    {
      value: 'Fixed',
      text: msg().Psa_Lbl_ContractFixed,
      disabled: false,
    },
  ];

  const [contractAmount, setContractAmount] = useState(values.contractAmount);
  const isPermissionRead = props.permission === 'Read' && !props.createProject;
  const changeContractAmount = (e) => {
    const val = e.target.value;
    const strippedVal = val.replace(/[^\d.-]/g, '');
    let pattern = `^[0-9]{1,12}$`;
    if (props.currencyDecimal !== 0) {
      pattern = `^[0-9]{1,12}(\\.[0-9]{0,${props.currencyDecimal}})?$`;
    }
    const re = new RegExp(pattern);
    if (val === '') {
      setContractAmount(Number(0));
      props.setFieldValue('contractAmount', Number(0));
    } else if (re.test(strippedVal)) {
      let finalVal = strippedVal;
      if (!strippedVal.includes('.')) finalVal = Number(strippedVal);
      setContractAmount(finalVal);
      props.setFieldValue('contractAmount', finalVal);
    }
  };

  const handleContractAmountBlur = () => {
    if (contractAmount.includes('.')) {
      if (contractAmount[contractAmount.length - 1] === '.') {
        setContractAmount(Number(contractAmount));
      }
    }
  };

  useEffect(() => {
    if (props.values.contractType === 'TnM') {
      setContractAmount(Number(0));
    } else {
      setContractAmount(values.contractAmount);
    }
  }, [props.values.contractType]);

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
                eItem.categoryType === CategoryType.ProjectFinancials && (
                  <FormField
                    title={eItem.name}
                    testId={`${ROOT}__eI`}
                    isRequired={eItem.required}
                    error={errors[eItem.id]}
                    isTouched={errors[eItem.id] || touched[eItem.id]}
                    errorTextClassName={`${ROOT}__errText`}
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
        {msg().Psa_Lbl_FormFinancials}
      </div>
      <section ref={refArray[2]} className={ROOT}>
        <FormField
          title={msg().Psa_Lbl_ContractType}
          testId={`${ROOT}__contract-type`}
          tooltip={props.customHint.contractType}
        >
          <SelectField
            disabled={
              (values.status !== 'Planning' && !props.createProject) ||
              isPermissionRead
            }
            onChange={(e) => {
              props.setFieldValue('contractType', e.target.value);
            }}
            options={contractTypeOptions}
            value={values.contractType}
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ContractAmount}
          testId={`${ROOT}__contract-amount`}
          error={props.errors.contractAmount}
          isTouched={props.touched.contractAmount}
          tooltip={props.customHint.contractAmount}
          isRequired={props.values.contractType !== 'TnM'}
        >
          <input
            className={'ts-text-field slds-input'}
            disabled={
              (values.status !== 'Planning' &&
                values.status !== 'InProgress' &&
                !props.createProject) ||
              values.contractType !== 'Fixed' ||
              isPermissionRead
            }
            onChange={changeContractAmount}
            value={contractAmount}
            onBlur={handleContractAmountBlur}
          />
        </FormField>
        <FormField
          title={`${msg().Psa_Lbl_TargetMargin} (%)`}
          testId={`${ROOT}__target-margin`}
          error={props.errors.targetMargin}
          isTouched={props.touched.targetMargin}
          tooltip={props.customHint.targetMargin}
        >
          <input
            className={'ts-text-field slds-input'}
            onChange={(e) => {
              // RegExp : any value from 0 to 999.99 with max 2 decimal places
              // used for target margin percentage
              if (e.target.value.match(/^\d{0,3}(\.\d{0,2})?$|^999.99$/)) {
                props.setFieldValue('targetMargin', e.target.value);
              }
            }}
            onBlur={(e) => {
              props.setFieldValue('targetMargin', Number(e.target.value) || 0);
            }}
            disabled={
              (values.status !== 'Planning' &&
                values.status !== 'InProgress' &&
                !props.createProject) ||
              isPermissionRead
            }
            value={values.targetMargin}
          />
        </FormField>
        {renderedExtendedItem}
      </section>
    </>
  );
};

export default Financials;
