import React from 'react';

import classNames from 'classnames';

import './TextField.scss';

export type Props = {
  id?: string;
  className?: string;
  type?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>, value?: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>, value?: string) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    value?: string
  ) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
  value?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder: string;
  isRequired?: boolean;
  label?: string;
  focus?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  maxLength?: number;
  autoFocus?: any;
};

export const TEXT_MAX_LENGTH = 255;

/**
 * テキスト項目 - 共通コンポーネント
 */
export default class TextField extends React.Component<Props> {
  titleRef: any;
  static get defaultProps() {
    return {
      type: 'text',
      disabled: false,
      readOnly: false,
      isRequired: false,
      placeholder: null,
      focus: false,
    };
  }

  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);

    this.titleRef = null;
  }

  componentDidMount() {
    if (this.props.focus && this.titleRef) {
      this.titleRef.focus();
    }
  }

  onFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (this.props.onFocus) {
      this.props.onFocus(e, e.target.value);
    }
  }

  onBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (this.props.onBlur) {
      this.props.onBlur(e, e.target.value);
    }
  }

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e, (e.target as any).value);
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.onChange) {
      this.props.onChange(e, e.target.value);
    }
  }

  render() {
    const {
      className,
      value = '',
      disabled,
      readOnly,
      placeholder,
      label,
      isRequired,
      focus: _focus,
      // There is no such thing as "focus" attribute in input
      ...props
    } = this.props;

    const textFieldClass = classNames('ts-text-field', 'slds-input', className);

    // 重複回避
    delete props.onFocus;
    delete props.onBlur;
    delete props.onKeyDown;
    delete props.onChange;

    if (readOnly) {
      return (
        <div
          className="ts-text-field ts-text-field--readonly"
          title={value as string}
        >
          {value}
        </div>
      );
    } else if (label) {
      const isRequiredString = isRequired ? (
        <span className="is-required">*</span>
      ) : (
        ''
      );
      return (
        <div className="ts-text-field-container">
          <p className="key">
            {isRequiredString}
            &nbsp;{label}
          </p>
          <input
            className={textFieldClass}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            ref={(ref) => {
              this.titleRef = ref;
            }}
            {...props}
          />
        </div>
      );
    } else {
      return (
        <input
          className={textFieldClass}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          ref={(ref) => {
            this.titleRef = ref;
          }}
          {...props}
        />
      );
    }
  }
}
