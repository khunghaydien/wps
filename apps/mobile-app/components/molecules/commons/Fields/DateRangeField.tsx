import * as React from 'react';

import omit from 'lodash/omit';

import Errors from '../../../atoms/Errors';
import DateField, { Props as $Props } from '../../../atoms/Fields/DateField';
import Icon from '../../../atoms/Icon';
import Label from '../../../atoms/Label';

import './DateRangeField.scss';

const ROOT = 'mobile-app-molecules-date-range-field';

type DateFieldProps = $Props & {
  label?: string;
  emphasis?: boolean;
  required?: boolean;
  testId?: string;
  onChange?: (
    arg0: React.SyntheticEvent<any>,
    arg1: { date: Date; formattedDate: string; timezoneOffset: number }
  ) => void | Promise<any>;
} & {
  errors?: string[];
};

export type Props = Readonly<{
  label?: string;
  testId?: string;
  required?: boolean;
  start: DateFieldProps;
  end: DateFieldProps;
}>;

export default class DateRangeField extends React.Component<Props> {
  render() {
    const testId = this.props.testId
      ? {
          start: `${this.props.testId}__start`,
          end: `${this.props.testId}__end`,
        }
      : {};
    const errors = [
      ...(this.props.start.errors || []),
      ...(this.props.end.errors || []),
    ];

    return (
      <div className={ROOT}>
        {this.props.label && (
          <Label text={this.props.label} marked={this.props.required} />
        )}
        <div className={`${ROOT}__fieldset`}>
          <div className={`${ROOT}__start`}>
            <DateField
              {...omit(this.props.start, 'errors')}
              testId={testId.start}
              maxDate={this.props.end.value}
              error={
                this.props.start.errors && this.props.start.errors.length > 0
              }
            />
          </div>
          <div className={`${ROOT}__hyphen`}>
            <Icon type="dash" size="x-small" />
          </div>
          <div className={`${ROOT}__end`}>
            <DateField
              {...omit(this.props.end, 'errors')}
              testId={testId.end}
              minDate={this.props.start.value}
              error={this.props.end.errors && this.props.end.errors.length > 0}
            />
          </div>
        </div>
        {errors.length > 0 && <Errors messages={errors} />}
      </div>
    );
  }
}
