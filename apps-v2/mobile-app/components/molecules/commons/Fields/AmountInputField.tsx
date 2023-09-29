import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import { InputProps } from '../../../atoms/Fields/InputProps';
import LabelWithHint from '../../../atoms/LabelWithHint';
import AmountInput from './AmountInput';

import './AmountInputField.scss';

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
    hintMsg?: string;
    isShowHint?: boolean;
    onClickHint?: () => void;
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
        <LabelWithHint
          className={`${ROOT}__label`}
          text={this.props.label}
          marked={this.props.required}
          emphasis={this.props.emphasis}
          hintMsg={this.props.hintMsg}
          onClickHint={this.props.onClickHint}
          isShowHint={this.props.isShowHint}
        />
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
            allowNegative: this.props.allowNegative,
          }}
        />
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
