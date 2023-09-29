// Reference url: https://react.lightningdesignsystem.com/components/date-pickers/
import * as React from 'react';

import classNames from 'classnames';

import {
  Datepicker,
  IconSettings,
  Input,
} from '@salesforce/design-system-react';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

// date field localizations
import initDateFieldLabels from './DateFieldLabels';

import './DateField.scss';
import './Input.scss';

const ROOT = 'mobile-app-atoms-date-field';

export type Props = Readonly<{
  className?: string;
  error?: boolean;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (
    arg0: React.SyntheticEvent<any>,
    arg1: { date: Date; formattedDate: string; timezoneOffset: number }
  ) => void | Promise<any>;
  minDate?: string;
  maxDate?: string;

  /* eslint-disable react/no-unused-prop-types */

  /*
  FIXME:
  You can erase it because you don't actually use it.
  However, there is a part of this component that specifies this props, so I'm currently disabling eslint.
  */
  emphasis?: boolean;
  testId?: string;
  required?: boolean;
  onBlur?: (arg0: React.SyntheticEvent<any>) => void;
  /* eslint-enable react/no-unused-prop-types */
}>;

export default class DateField extends React.PureComponent<Props> {
  render() {
    const { value, placeholder, minDate, maxDate } = this.props;
    const datepickerValue = value ? new Date(value) : null;
    const dateFieldLabels = {
      ...initDateFieldLabels(),
      placeholder: placeholder || msg().Com_Lbl_MobilePleaseTapAndSelectDate,
    };
    const rootCss = classNames(ROOT, this.props.className);

    return (
      <div className={rootCss}>
        <IconSettings iconPath={window.__icon_path__}>
          <Datepicker
            className={ROOT}
            triggerClassName={this.props.error ? 'is-error' : null}
            labels={dateFieldLabels}
            onChange={this.props.onChange}
            menuPosition="overflowBoundaryElement"
            value={datepickerValue}
            dateDisabled={(data: { date: string }) =>
              (minDate && DateUtil.isBefore(data.date, minDate)) ||
              (maxDate && DateUtil.isBefore(maxDate, data.date))
            }
          >
            <Input
              disabled={this.props.disabled || this.props.readOnly}
              className={classNames(`${ROOT}__input`, {
                'is-read-only': this.props.readOnly,
              })}
              readOnly
              value={DateUtil.dateFormat(value)}
            />
          </Datepicker>
        </IconSettings>
      </div>
    );
  }
}
