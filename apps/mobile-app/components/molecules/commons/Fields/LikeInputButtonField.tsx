import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import LabelWithHint from '../../../atoms/LabelWithHint';
import LikeInputButton, { ButtonType } from '../LikeInputButton';

const ROOT = 'mobile-app-molecules-commons-field-link-input-button-field';

type Props = Readonly<{
  className?: string;
  errors?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  label?: string;
  testId?: string;
  type?: ButtonType;
  value: string;
  onClick?: () => void;
  // Custom Hint
  hintMsg?: string;
  isShowHint?: boolean;
  onClickHint?: () => void;
}>;

export default class LikeInputButtonField extends React.Component<Props> {
  render() {
    const errors = this.props.errors || [];
    const hasErrors = errors.length > 0;
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <LabelWithHint
          className={`${ROOT}__label`}
          text={this.props.label || ''}
          marked={this.props.required}
          hintMsg={this.props.hintMsg}
          isShowHint={this.props.isShowHint}
          onClickHint={this.props.onClickHint}
        />
        <LikeInputButton
          className={`${ROOT}__button`}
          testId={this.props.testId}
          error={hasErrors}
          disabled={this.props.disabled}
          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
          type={this.props.type}
          value={this.props.value}
          onClick={this.props.onClick}
        />
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
