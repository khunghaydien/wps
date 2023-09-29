import * as React from 'react';
import TextAreaAutoSize from 'react-textarea-autosize';

import classNames from 'classnames';

import './TextAreaField.scss';

/**
 * テキストエリア項目 - 共通コンポーネント
 */
type Props = {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, arg1?: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>, arg1: string) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>, arg1: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, arg1: string) => void;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autosize?: boolean;
  rows?: number;
  label?: string;
  inputRef?: (arg0: HTMLTextAreaElement) => void;
  minRows?: number;
  maxRows?: number;
  resize?: 'none';
  isRequired?: boolean;
  maxLength?: number;
};

type State = { textarea: React.ComponentType<Props> | Function };

const ROOT = 'ts-textarea-field';

export default class TextAreaField extends React.Component<Props, State> {
  state = {
    textarea: this.props.autosize
      ? TextAreaAutoSize
      : (ps: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
          <textarea {...ps} />
        ),
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.autosize !== this.props.autosize) {
      this.setState({
        textarea: nextProps.autosize
          ? TextAreaAutoSize
          : (ps: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
              <textarea {...ps} />
            ),
      });
    }
  }

  onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.props.onFocus) {
      this.props.onFocus(e, e.target.value);
    }
  };

  onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onBlur) {
      this.props.onBlur(e, e.target.value);
    }
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e, (e.target as HTMLInputElement).value);
    }
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e, e.target.value);
    }
  };

  static defaultProp = {
    disabled: false,
    readOnly: false,
    autosize: false,
  };

  render() {
    const {
      className,
      value,
      placeholder,
      disabled,
      readOnly,
      label,
      isRequired,
      minRows,
      maxRows,
      resize,
      inputRef,
      ...props
    } = this.props;

    const textAreaFieldClass = classNames(ROOT, className, {
      'slds-input': true,
      [`${ROOT}--no-resize`]: resize === 'none',
    });

    const TextArea = this.state.textarea;

    // 重複回避
    delete props.onFocus;
    delete props.onBlur;
    delete props.onKeyDown;
    delete props.onChange;

    if (readOnly) {
      return <div className={`${ROOT} ${ROOT}--readonly`}>{value}</div>;
    } else {
      const body = this.props.autosize ? (
        // @ts-ignore
        <TextArea
          className={textAreaFieldClass}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          minRows={minRows}
          maxRows={maxRows}
          inputRef={inputRef}
          {...props}
        />
      ) : (
        // @ts-ignore
        <TextArea
          className={textAreaFieldClass}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
      );
      if (label) {
        const isRequiredString = isRequired ? (
          <span className="is-required">*</span>
        ) : (
          ''
        );
        return (
          <div className={`${ROOT}-container`}>
            <p className="key">
              {isRequiredString}
              &nbsp;{label}
            </p>
            {body}
          </div>
        );
      } else {
        return body;
      }
    }
  }
}
