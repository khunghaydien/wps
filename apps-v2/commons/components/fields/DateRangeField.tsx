import React from 'react';

import classNames from 'classnames';

import DateField, { Props as DateFieldProps } from './DateField';

import './DateRangeField.scss';

const ROOT = 'ts-date-range-field';

type Props = {
  startDateFieldProps?: any;
  endDateFieldProps?: any;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

/**
 * 期間選択項目 - 共通コンポーネント
 */

export default class DateRangeField extends React.Component<Props> {
  static defaultProps = {
    className: '',
    required: false,
    disabled: false,
  };

  render() {
    const fieldClass = classNames(ROOT, this.props.className);

    const {
      value: valueOfStartDateField,
      selected: selectedOfStartDateField,
      maxDate: maxDateOfStartDateField,
      className: classNameOfStartDateField,
      required: requiredOfStartDateField,
      disabled: disabledOfStartDateField,
      ...restPropsOfStartDateField
    }: { value: any } & DateFieldProps = this.props.startDateFieldProps;

    const {
      value: valueOfEndDateField,
      selected: selectedOfEndDateField,
      minDate: minDateOfStartDateField,
      className: classNameOfEndDateField,
      required: requiredOfEndDateField,
      disabled: disabledOfEndDateField,
      ...restPropsOfEndDateField
    }: { value: any } & DateFieldProps = this.props.endDateFieldProps;

    return (
      <div className={fieldClass}>
        <span className={`${ROOT}__input`}>
          <DateField
            value={valueOfStartDateField}
            selected={selectedOfStartDateField}
            maxDate={maxDateOfStartDateField || valueOfEndDateField}
            className={classNames('slds-input', classNameOfStartDateField)}
            required={this.props.required || requiredOfStartDateField}
            disabled={this.props.disabled || disabledOfStartDateField}
            {...restPropsOfStartDateField}
          />
        </span>

        <span className={`${ROOT}__separation`}>
          <span className={`${ROOT}__separation-inner`}>–</span>
        </span>

        <span className={`${ROOT}__input`}>
          <DateField
            value={valueOfEndDateField}
            selected={selectedOfEndDateField}
            minDate={minDateOfStartDateField || valueOfStartDateField}
            className={classNames('slds-input', classNameOfEndDateField)}
            required={this.props.required || requiredOfEndDateField}
            disabled={this.props.disabled || disabledOfEndDateField}
            {...restPropsOfEndDateField}
          />
        </span>
      </div>
    );
  }
}
