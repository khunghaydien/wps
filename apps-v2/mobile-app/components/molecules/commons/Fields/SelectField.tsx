import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import Select from '../../../atoms/Fields/Select';
import {
  mapPropsToSelectProps,
  SelectProps,
} from '../../../atoms/Fields/SelectProps';
import { IconSetType } from '../../../atoms/Icon/IconSet';
import LabelWithHint from '../../../atoms/LabelWithHint';

const ROOT = 'mobile-app-molecules-commons-select-field';

export type Props = Readonly<
  SelectProps & {
    className?: string;
    emphasis?: boolean;
    errors?: string[];
    label: string;
    testId?: string;
    options:
      | Array<{
          label: string;
          value: string | number | null;
          disabled?: boolean;
        }>
      | Array<{
          label: string;
          value: string;
          disabled?: boolean;
        }>
      | Array<{
          label: string;
          value: number;
          disabled?: boolean;
        }>
      | Array<{
          label: string;
          value: null;
          disabled?: boolean;
        }>;
    placeholder?: string;
    icon?: IconSetType;
    value?: any;
    // Custom Hint
    hintMsg?: string;
    isShowHint?: boolean;
    onClickHint?: () => void;
  }
>;

export default class SelectField extends React.PureComponent<Props> {
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
          isShowHint={this.props.isShowHint}
          onClickHint={this.props.onClickHint}
        />
        <Select
          {...mapPropsToSelectProps(this.props)}
          placeholder={this.props.placeholder}
          icon={this.props.icon}
          options={this.props.options}
          value={this.props.value}
          error={hasErrors}
          testId={this.props.testId}
        />
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
