import * as React from 'react';

import classNames from 'classnames';

import Icon from '../Icon';
// NOTE 通常はatoms -> atomsへの依存はよくないのだけど、Iconに限り例外的にそうしている
import { IconSetType } from '../Icon/IconSet';
import { InputProps, mapPropsToInputProps } from './InputProps';

import './Input.scss';

const ROOT = 'mobile-app-atoms-input';

type Props = Readonly<
  InputProps & {
    className?: string;
    error?: boolean;
    icon?: IconSetType;
    testId?: string;
    iconClick?: () => void;
    isHideKeyboard?: boolean;
    type:
      | 'date'
      | 'datetime-locale'
      | 'file'
      | 'hidden'
      | 'month'
      | 'number'
      | 'password'
      | 'text'
      | 'time'
      | 'week';
    'aria-describedby'?: string;
  }
>;

export default class Input extends React.PureComponent<Props> {
  input: any;

  constructor(props: Props) {
    super(props);

    this.input = React.createRef();
  }

  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--error`]: this.props.error,
      [`${ROOT}--disabled`]: this.props.disabled,
      [`${ROOT}--read-only`]: this.props.readOnly,
    });

    return (
      <div className={className} onClick={() => this.input.current.focus()}>
        {/* @ts-ignore */}
        <input
          className={`${ROOT}__input`}
          data-test-id={this.props.testId}
          type={this.props.type}
          onChange={this.props.onChange}
          value={this.props.value}
          placeholder={this.props.placeholder}
          required={this.props.required}
          autoFocus={this.props.autoFocus}
          aria-invalid={this.props.error}
          aria-describedby={this.props['aria-describedby']}
          {...mapPropsToInputProps(this.props)}
          ref={this.input}
        />
        {this.props.icon ? (
          <div
            className={`${ROOT}__icon`}
            onClick={() => {
              if (this.props.isHideKeyboard) {
                setTimeout(() => {
                  this.input.current.blur();
                  (document.activeElement as HTMLElement).blur();
                }, 0);
              }
              this.props.iconClick();
            }}
          >
            <Icon type={this.props.icon} size="medium" />
          </div>
        ) : null}
      </div>
    );
  }
}
