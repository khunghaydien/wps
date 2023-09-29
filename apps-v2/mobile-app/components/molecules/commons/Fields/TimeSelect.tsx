import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import range from 'lodash/range';
import MultiPicker from 'rmc-picker/lib/MultiPicker';
import Picker from 'rmc-picker/lib/Picker';
import Popup from 'rmc-picker/lib/Popup';

import msg from '../../../../../commons/languages';
import { parseIntOrNull } from '../../../../../commons/utils/NumberUtil';

import Icon from '../../../atoms/Icon';

import './TimeSelect.scss';

const ROOT = 'mobile-app-molecules-commons-fields-time-select';

const DEFAULT_MIN_TIME = '00:00';
const DEFAULT_MAX_TIME = '23:59';
const MIN_MINUTE = 0;
const MAX_MINUTE = 59;
const IDX_HOUR = 0;
const IDX_MINUTE = 1;

type TimeArray = [number | null, number | null];

type TimePickerProps = Readonly<{
  time?: string;
  minTime?: string;
  maxTime?: string;
  defaultTime?: string;
  formatHour?: (arg0: number) => string;
  formatMinute?: (arg0: number) => string;
  onTimeChange?: (arg0: string) => void;
  onValueChange?: (arg0: TimeArray, arg1: number) => void;
}>;

type TimePickerState = {
  time: string;
  selectedTime: TimeArray | null;
};

const parseTimeToArray = (value: string): TimeArray => {
  const arr = value.split(':');
  return [parseIntOrNull(arr[0]), parseIntOrNull(arr[1])];
};

const parseArrayToTime = (values: TimeArray): string =>
  values.some((val) => val === null)
    ? ''
    : values.map((v) => String(v).padStart(2, '0')).join(':');

/**
 * TimePicker
 *
 * `rmc-picker/lib/Popup` is used refs attribute.
 * https://github.com/react-component/m-picker/blob/5.0.5/src/PopupMixin.tsx#L129
 *
 * However, "You may not use the ref attribute on functional components because they don’t have instances."
 * https://5b90c17ac9659241e7f4c938--reactjs.netlify.com/docs/refs-and-the-dom.html#refs-and-functional-components
 *
 * This component is need to be class Component.
 */
class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
  constructor(props: TimePickerProps) {
    super(props);

    this.state = {
      time: props.time || props.defaultTime || '',
      selectedTime: null,
    };

    this.onValueChange = this.onValueChange.bind(this);
  }

  static getDerivedStateFromProps(
    nextProps: TimePickerProps,
    prevState: TimePickerState
  ) {
    if (prevState.time !== nextProps.time) {
      return {
        time: nextProps.time || nextProps.defaultTime || '',
      };
    }
    return null;
  }

  onValueChange(values: TimeArray, index: number) {
    const props = this.props;
    const newValue = parseArrayToTime(values);
    this.setState({
      selectedTime: values,
    });
    this.setState({
      time: newValue,
    });
    if (props.onTimeChange) {
      props.onTimeChange(newValue);
    }
    if (props.onValueChange) {
      props.onValueChange(values, index);
    }
  }

  getValue() {
    return this.state.time;
  }

  getSelectedValue() {
    const { time, selectedTime } = this.state;
    return selectedTime || parseTimeToArray(String(time));
  }

  getTimeArray(value: string): [number, number] {
    const timeArray = parseTimeToArray(value);
    return [timeArray[0] || 0, timeArray[1] || 0];
  }

  createOptions(
    min: number,
    max: number,
    formatter?: (arg0: number) => string
  ) {
    return [
      {
        key: '--',
        label: '--',
        value: null,
      },
      ...range(min, max + 1).map((val: number) => ({
        key: val,
        label: formatter ? formatter(val) : String(val).padStart(2, '0'),
        value: val,
      })),
    ];
  }

  getTimeOptions() {
    const { minTime, maxTime, formatMinute, formatHour } = this.props;
    const selectedValue = this.getSelectedValue();
    const min = this.getTimeArray(minTime || DEFAULT_MIN_TIME);
    const max = this.getTimeArray(maxTime || DEFAULT_MAX_TIME);

    const hours = this.createOptions(min[IDX_HOUR], max[IDX_HOUR], formatHour);
    let minutes = [];

    if (
      selectedValue[IDX_HOUR] === min[IDX_HOUR] &&
      selectedValue[IDX_HOUR] === max[IDX_HOUR]
    ) {
      minutes = this.createOptions(
        min[IDX_MINUTE],
        max[IDX_MINUTE],
        formatMinute
      );
    } else if (selectedValue[IDX_HOUR] === min[IDX_HOUR]) {
      minutes = this.createOptions(min[IDX_MINUTE], MAX_MINUTE, formatMinute);
    } else if (selectedValue[IDX_HOUR] === max[IDX_HOUR]) {
      minutes = this.createOptions(MIN_MINUTE, max[IDX_MINUTE], formatMinute);
    } else {
      minutes = this.createOptions(MIN_MINUTE, MAX_MINUTE, formatMinute);
    }

    return {
      hours,
      minutes,
    };
  }

  render() {
    const selectedValue = this.getSelectedValue();
    const { hours, minutes } = this.getTimeOptions();

    return (
      <MultiPicker
        selectedValue={selectedValue}
        onValueChange={this.onValueChange}
      >
        <Picker
          key="hours"
          indicatorClassName={`${ROOT}__time-picker-indicator`}
        >
          {hours.map(({ key, value, label }) => (
            <Picker.Item key={key} value={value}>
              {label}
            </Picker.Item>
          ))}
        </Picker>
        <Picker
          key="minutes"
          indicatorClassName={`${ROOT}__time-picker-indicator`}
        >
          {minutes.map(({ key, value, label }) => (
            <Picker.Item key={key} value={value}>
              {label}
            </Picker.Item>
          ))}
        </Picker>
      </MultiPicker>
    );
  }
}

export type Props = Readonly<{
  className?: string;
  value?: string;
  defaultValue?: string;
  minValue?: string;
  maxValue?: string;
  placeholder?: string;
  useTitle?: boolean;
  formatHour?: (arg0: number) => string;
  formatMinute?: (arg0: number) => string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  icon?: boolean;
  testId?: string;
  onChange?: (arg0: string) => void;
}>;

const TimeSelect = (props: Props) => {
  const [time, setTime] = useState(props.value);

  useEffect(() => {
    setTime(props.value);
  }, [props.value]);

  return (
    <div className={classNames(ROOT, props.className)}>
      <Popup
        className={`${ROOT}__time-select`}
        okText={msg().Com_Lbl_Done}
        dismissText={msg().Com_Lbl_Dismiss}
        title={props.useTitle ? time : ''}
        value={time}
        onOk={(value) => {
          if (props.onChange) {
            props.onChange(value || '');
          }
        }}
        onVisibleChange={(visible) => {
          if (!visible) {
            setTime(props.value);
          }
        }}
        picker={
          <TimePicker
            maxTime={props.maxValue}
            minTime={props.minValue}
            defaultTime={props.defaultValue}
            formatHour={props.formatHour}
            formatMinute={props.formatMinute}
            onTimeChange={(v) => {
              setTime(v);
            }}
          />
        }
        pickerValueProp="time"
        pickerValueChangeProp="onTimeChange"
        disabled={props.readOnly || props.disabled}
      >
        <button
          className={classNames(`${ROOT}__button`, {
            [`${ROOT}__button--error`]: props.error,
            [`${ROOT}__button--disabled`]: props.disabled,
            [`${ROOT}__button--read-only`]: props.readOnly,
            [`${ROOT}__button--placeholder`]: !props.value,
          })}
          data-test-id={props.testId}
          disabled={props.disabled}
          onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <div className={`${ROOT}__trigger`}>
            <div className={`${ROOT}__trigger-label`}>
              {props.value || props.placeholder}
            </div>
            {props.icon ? (
              <div className={`${ROOT}__trigger-icon`}>
                <Icon type="clock" size="medium" />
              </div>
            ) : null}
          </div>
        </button>
      </Popup>
    </div>
  );
};

export default TimeSelect;
