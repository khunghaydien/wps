import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import IconButton from '../../../atoms/IconButton';
import LabelWithHint from '../../../atoms/LabelWithHint';
import LikeInputButton from '../LikeInputButton';

import './SearchButtonField.scss';

const ROOT = 'mobile-app-molecules-commons-field-search-button-field';

type Props = Readonly<{
  className?: string;
  errors?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  label?: string;
  testId?: string;
  value: string;
  onClick?: () => void;
  onClickDeleteButton?: () => void;
  // Custom Hint
  hintMsg?: string;
  isShowHint?: boolean;
  onClickHint?: () => void;
}>;

export default class SearchButtonField extends React.Component<Props> {
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
          className={`${ROOT}-button`}
          testId={this.props.testId}
          error={hasErrors}
          disabled={this.props.disabled}
          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onClick={this.props.onClick}
        />
        <IconButton
          className={`${ROOT}-icon-button`}
          icon="clear"
          onClick={this.props.onClickDeleteButton}
          disabled={this.props.disabled}
        />

        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
