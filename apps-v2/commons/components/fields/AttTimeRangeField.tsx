import React from 'react';

import classNames from 'classnames';

import AttTimeField from './AttTimeField';

import './AttTimeRangeField.scss';

const ROOT = 'commons-fields-att-time-range-field';

type Props = {
  onBlurAtStart: (value: string) => void;
  onBlurAtEnd: (value: string) => void;
  startTime?: string;
  endTime?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
};

/**
 * 勤怠時間帯フィールド
 * TimeRangeField.js と異なり、25:00 以降の表記にも対応している
 */
export default class AttTimeRangeField extends React.Component<Props> {
  static defaultProps = {
    startTime: '',
    endTime: '',
    className: '',
    required: false,
    disabled: false,
  };

  render() {
    const cssClass = classNames(ROOT, this.props.className);

    return (
      <div className={`${cssClass}`}>
        <span className={`${ROOT}__input`}>
          <AttTimeField
            value={this.props.startTime || ''}
            required={this.props.required}
            onBlur={this.props.onBlurAtStart}
            disabled={this.props.disabled}
            placeholder={this.props.startPlaceholder}
          />
        </span>

        <span className={`${ROOT}__separation`}>
          <span className={`${ROOT}__separation-inner`}>–</span>
        </span>

        <span className={`${ROOT}__input`}>
          <AttTimeField
            value={this.props.endTime || ''}
            required={this.props.required}
            onBlur={this.props.onBlurAtEnd}
            disabled={this.props.disabled}
            placeholder={this.props.endPlaceholder}
          />
        </span>
      </div>
    );
  }
}
