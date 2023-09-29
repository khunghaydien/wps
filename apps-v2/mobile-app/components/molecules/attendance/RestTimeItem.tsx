import * as React from 'react';

import classNames from 'classnames';

import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import IconButton from '../../atoms/IconButton';
import AttTimeSelectRangeField, {
  TimeFieldProps,
} from './AttTimeSelectRangeField';
import RestReason from './RestReasonField';

import './RestTimeItem.scss';

const ROOT = 'mobail-app-molecules-attendance-rest-time-item';

type Props = Readonly<{
  testId?: string;
  className?: string;
  placeholder?: string;
  label: string;
  errors?: string[];
  startTime: TimeFieldProps;
  endTime: TimeFieldProps;
  readOnly?: boolean;
  isHiddenRemove?: boolean;
  isDisabledRemove?: boolean;
  enabledRestReason: boolean;
  restTimeReasons: RestTimeReason[];
  selectedRestReason: RestTimeReason;
  onUpdateReason: (value: RestTimeReason | null) => void;
  onClickRemove: () => void;
}>;

export default class RestTimeItem extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--enabled-rest-reason`]: this.props.enabledRestReason,
    });
    const { readOnly, selectedRestReason } = this.props;
    return (
      <div className={className}>
        <AttTimeSelectRangeField
          className={`${ROOT}__att-time-range`}
          testId={this.props.testId}
          label={this.props.label}
          errors={this.props.errors}
          from={this.props.startTime}
          to={this.props.endTime}
          readOnly={readOnly}
          placeholder={this.props.placeholder}
          actions={[
            <>
              {this.props.enabledRestReason ? (
                <div key={'rest-reason'} className={`${ROOT}__rest-reason`}>
                  <div className={`${ROOT}__separator-text`}></div>
                  <div className={`${ROOT}__rest-reason-list`}>
                    <RestReason
                      error={this.props.errors && !!this.props.errors.length}
                      value={selectedRestReason}
                      restTimeReasons={this.props.restTimeReasons}
                      onUpdateReason={this.props.onUpdateReason}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              ) : null}
            </>,
            <div key={'icon'} className={`${ROOT}__icon`}>
              {!this.props.isHiddenRemove && (
                <IconButton
                  icon="close-copy"
                  onClick={this.props.onClickRemove}
                  disabled={readOnly || this.props.isDisabledRemove}
                />
              )}
            </div>,
          ]}
        />
      </div>
    );
  }
}
