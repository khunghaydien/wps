import React from 'react';

import classNames from 'classnames';

import { Props as DateFieldProps } from '@apps/commons/components/fields/DateField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';

import './index.scss';

export type Props = {
  startDateFieldProps?: any;
  endDateFieldProps?: any;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  isResetted?: boolean;
  doRefresh?: number;
};

const ROOT = 'ts-psa__date-range-field';

const PsaDateRangeField = (props: Props) => {
  const fieldClass = classNames(ROOT, props.className);

  const {
    value: valueOfStartDateField,
    maxDate: maxDateOfStartDateField,
    className: classNameOfStartDateField,
    required: requiredOfStartDateField,
    disabled: disabledOfStartDateField,
    ...restPropsOfStartDateField
  }: { value: any } & DateFieldProps = props.startDateFieldProps;

  const {
    value: valueOfEndDateField,
    minDate: minDateOfStartDateField,
    className: classNameOfEndDateField,
    required: requiredOfEndDateField,
    disabled: disabledOfEndDateField,
    ...restPropsOfEndDateField
  }: { value: any } & DateFieldProps = props.endDateFieldProps;

  return (
    <div className={fieldClass}>
      <div className={`${ROOT}__input`}>
        <PsaDateField
          value={valueOfStartDateField}
          maxDate={maxDateOfStartDateField || valueOfEndDateField}
          className={classNames('slds-input', classNameOfStartDateField)}
          required={props.required || requiredOfStartDateField}
          disabled={props.disabled || disabledOfStartDateField}
          {...restPropsOfStartDateField}
          enableValidation
          isResetted={props.isResetted}
          doRefresh={props.doRefresh}
        />
      </div>

      <span className={`${ROOT}__separation`}>
        <span className={`${ROOT}__separation-inner`}>–</span>
      </span>

      <div className={`${ROOT}__input`}>
        <PsaDateField
          value={valueOfEndDateField}
          minDate={minDateOfStartDateField || valueOfStartDateField}
          className={classNames('slds-input', classNameOfEndDateField)}
          required={props.required || requiredOfEndDateField}
          disabled={props.disabled || disabledOfEndDateField}
          {...restPropsOfEndDateField}
          enableValidation
          isResetted={props.isResetted}
          doRefresh={props.doRefresh}
        />
      </div>
    </div>
  );
};
export default PsaDateRangeField;
