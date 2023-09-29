import * as React from 'react';

import classNames from 'classnames';

import Icon from '../Icon';
// NOTE 通常はatoms -> atomsへの依存はよくないのだけど、Iconに限り例外的にそうしている
import { IconSetType } from '../Icon/IconSet';
import { mapPropsToSelectProps, SelectProps } from './SelectProps';

import './Select.scss';

const ROOT = 'mobile-app-atoms-select';

type Props = SelectProps & {
  error?: boolean;
  name?: string;
  className?: string;
  placeholder?: string;
  testId?: string;
  icon?: IconSetType | false;
  options: Array<{
    label: string;
    value: any;
    disabled?: boolean;
  }>;
  value?: any;
  'aria-describedby'?: string;
};

type State = {
  selectRef: HTMLSelectElement | null | undefined;
};

export default class Select extends React.Component<Props, State> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--error`]: this.props.error,
      [`${ROOT}--disabled`]: this.props.disabled,
      [`${ROOT}--read-only`]: this.props.readOnly,
    });

    return (
      <div className={className}>
        <select
          key="select"
          {...mapPropsToSelectProps(this.props)}
          className={`${ROOT}__select`}
          data-test-id={this.props.testId}
          name={this.props.name}
          value={this.props.value}
          aria-invalid={this.props.error}
          aria-describedby={this.props['aria-describedby']}
        >
          {this.props.placeholder && <option>{this.props.placeholder}</option>}
          {this.props.options.map(({ value, label, disabled }) => (
            <option
              key={value}
              value={value}
              disabled={
                (this.props.readOnly && this.props.value !== value) ||
                !!disabled
              }
            >
              {label}
            </option>
          ))}
        </select>
        {(this.props.size === null ||
          this.props.size === undefined ||
          this.props.size <= 1) &&
          !this.props.multiple &&
          this.props.icon !== false && (
            <div className={`${ROOT}__icon`} key="icon">
              <Icon type={this.props.icon || 'chevrondown'} size="medium" />
            </div>
          )}
      </div>
    );
  }
}
