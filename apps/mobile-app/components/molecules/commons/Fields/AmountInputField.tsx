import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import { InputProps } from '../../../atoms/Fields/InputProps';
import Label from '../../../atoms/Label';
import AmountInput from './AmountInput';

const ROOT = 'mobile-app-molecules-commons-amount-input-field';

type Props = Readonly<
  InputProps & {
    className?: string;
    emphasis?: boolean;
    errors?: string[];
    label: string;
    testId?: string;
    value: number;
    decimalPlaces?: number;
    onBlur: (arg0: number | null) => void;
  }
>;

export default class AmountInputField extends React.PureComponent<Props> {
  render() {
    const errors = this.props.errors || [];
    const hasErrors = errors.length > 0;
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <Label
          className={`${ROOT}__label`}
          text={this.props.label}
          marked={this.props.required}
          emphasis={this.props.emphasis}
        >
          <AmountInput
            {...{
              name: this.props.name,
              autoFocus: this.props.autoFocus,
              disabled: this.props.disabled,
              max: this.props.max,
              maxLength: this.props.maxLength,
              min: this.props.min,
              minLength: this.props.minLength,
              placeholder: this.props.placeholder,
              required: this.props.required,
              readOnly: this.props.readOnly,
              decimalPlaces: this.props.decimalPlaces,
              value: this.props.value,
              error: hasErrors,
              onBlur: this.props.onBlur,
              testId: this.props.testId,
            }}
          />
        </Label>
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
