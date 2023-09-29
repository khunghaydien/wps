import * as React from 'react';

import classNames from 'classnames';
import DatePicker from 'rmc-date-picker';
import DatePickerPopup from 'rmc-date-picker/lib/Popup';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';

import Icon from '../../../atoms/Icon';
import TextButton from '../../../atoms/TextButton';

import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-picker/assets/popup.css';
import './DateSelect.scss';

const ROOT = 'mobile-app-molecules-date-select';

const Popup = DatePickerPopup as unknown as React.ComponentType<
  React.ComponentProps<typeof DatePickerPopup> & { children: React.ReactNode }
>;

type Props = Readonly<{
  testId?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (arg0: string) => void;
}>;

type State = {
  value: Date;
  originalValue?: string;
};

export default class DateSelect extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): State | null {
    if (nextProps.value && nextProps.value !== prevState.originalValue) {
      return {
        value: nextProps.value ? new Date(nextProps.value) : new Date(),
        originalValue: nextProps.value,
      };
    }
    return null;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.props.value ? new Date(this.props.value) : new Date(),
      originalValue: this.props.value,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onDateChange(date: Date): void {
    this.setState({
      value: date,
    });
  }

  onChange(date: Date): void {
    const isoDateString = DateUtil.formatISO8601Date(date.toISOString());
    if (this.props.onChange) {
      this.props.onChange(isoDateString);
    }
  }

  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <Popup
          className={`${ROOT}__datepicker`}
          value={this.state.value}
          onChange={this.onChange}
          okText={msg().Com_Lbl_Done}
          dismissText={msg().Com_Lbl_Dismiss}
          title={DateUtil.formatYMD(this.state.value.toISOString())}
          datePicker={
            <DatePicker
              rootNativeProps={{ 'data-xx': 'yy' }}
              formatMonth={(month: number) => DateUtil.formatMonth(month)}
              onDateChange={this.onDateChange}
            />
          }
        >
          <TextButton
            date-test-id={this.props.testId}
            disabled={this.props.disabled}
            className={`${ROOT}__text-button`}
          >
            <div className={`${ROOT}__trigger`}>
              <div className={`${ROOT}__trigger-label`}>
                {DateUtil.formatYMD(this.props.value)}
              </div>
              <div className={`${ROOT}__trigger-icon`}>
                <Icon type="chevrondown" />
              </div>
            </div>
          </TextButton>
        </Popup>
      </div>
    );
  }
}
