import * as React from 'react';

import classNames from 'classnames';

import IconButton from '../../atoms/IconButton';
import AttTimeSelectRangeField, {
  TimeFieldProps,
} from './AttTimeSelectRangeField';

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
  onClickRemove: () => void;
}>;

export default class RestTimeItem extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { readOnly } = this.props;
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
            <div className={`${ROOT}__icon`}>
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
