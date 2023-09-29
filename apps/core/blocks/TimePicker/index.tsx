import React, { forwardRef } from 'react';

import isNil from 'lodash/isNil';

import TimeUtil from '../../../commons/utils/TimeUtil';

import Combobox from '../../elements/Combobox';
import { useMinuteOptions } from './hooks';

type InputProps = Omit<
  React.PropsWithoutRef<React.ComponentProps<'input'>>,
  'children' | 'value' | 'onSelect'
>;

interface Props extends InputProps {
  'data-testid'?: string;
  isOpenByDefault?: boolean;

  /**
   * Upper limit of time that can be entered.
   * `TimePicker` handles input value being equal or larger than `maxValidMinutes` as invalid input.
   * This value should be the elapsed time since 0:00, and UPPER than `maxMinutes` for UX.
   *
   * @default 1440
   */
  maxValidMinutes?: number;

  /**
   * Lower limit of time that can be entered.
   * `TimePicker` handles input value being less than `minValidMinutes` as invalid input.
   * This value should be This value should be the elapsed time since 0:00, and EQUAL or LOWER than `minMinutes` for UX.
   *
   * @default 0
   */
  minValidMinutes?: number;

  /**
   * The interval of time items displayed in the menu.
   * This value must be minutes.
   */
  stepInMinutes?: number;

  /**
   * Maximum value of a time item.
   * This value must be the elapsed minutes since 0:00.
   */
  minMinutes?: number;

  /**
   * Minimum value of a time item.
   * This value must be the elapsed minutes since 0:00.
   */
  maxMinutes?: number;

  /**
   * The selected or inputted value of `TimePicker`.
   * The value should be formatted as 'HH:mm', but `TimePicker` accept also
   * 'hhmm' format like '0300' converting to '03:00'.
   */
  value?: (string | null | undefined) | (Date | null | undefined);

  /**
   * The event handler fired on select/input a time
   * @param value {string} selected or inputted time. (formatted as HH:mm .)
   * @param minutes {number} selected or inputted time. (The elapsed time since 0:00, expressed in minutes.)
   */
  onSelect?: (value: string, minutes: number) => void;

  /**
   * The event fired on blur TimePicker
   * @param event {SyntheticEvent<HTMLElement>} a fired event
   */
  onBlur?: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const parseValueToTime = (
  value: (string | null | undefined) | (Date | null | undefined),
  minMinutes: number,
  maxMinutes: number
): [string, null | number, boolean] => {
  if (value) {
    // TODO Convert Date to string
    // @ts-ignore
    const formattedValue: string = TimeUtil.supportFormat(value, maxMinutes);
    const minutes: null | number = TimeUtil.parseMinutes(formattedValue);
    const isValidFormat: boolean = formattedValue !== '' && !isNil(minutes);
    const isValidRange =
      !isNil(minutes) && minMinutes <= minutes && minutes < maxMinutes;
    const timeValue =
      isValidFormat && isValidRange ? formattedValue : 'Invalid Input';
    return [timeValue, minutes, isValidFormat && isValidRange];
  } else {
    return ['', null, true];
  }
};

const TimePicker = forwardRef<HTMLInputElement, Props>(
  (
    {
      minValidMinutes = 0,
      maxValidMinutes = 1440,
      stepInMinutes = 30,
      minMinutes = 0,
      maxMinutes = 1440,
      isOpenByDefault,
      value = '',
      ...props
    }: Props,
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState<string>(() => {
      const [timeValue] = parseValueToTime(
        value,
        minValidMinutes,
        maxValidMinutes
      );
      return timeValue;
    });

    React.useEffect(() => {
      const [timeValue] = parseValueToTime(
        value,
        minValidMinutes,
        maxValidMinutes
      );
      setInputValue(timeValue);
    }, [value, minMinutes, maxMinutes]);

    const options = useMinuteOptions(minMinutes, maxMinutes, stepInMinutes);

    const onChange = React.useCallback((value: string) => {
      setInputValue(value);
    }, []);

    const onSelect = React.useCallback(
      (option: { value: string; label: string; id: string }) => {
        props.onSelect(option.value, TimeUtil.parseMinutes(option.value));
      },
      [props.onSelect]
    );

    const onBlur = (event: React.SyntheticEvent<HTMLElement>): void => {
      // Fire custom blue event
      if (props.onBlur) {
        props.onBlur(event);
      }

      // Fire select event to return inputted value to upstream
      const [timeValue, minutes, isValid] = parseValueToTime(
        inputValue,
        minValidMinutes,
        maxValidMinutes
      );
      if (isValid) {
        onChange(timeValue);
        props.onSelect(timeValue, minutes);
      } else {
        onChange(value as string);
      }
    };

    return (
      <Combobox
        ref={ref}
        {...props}
        value={inputValue}
        options={options}
        isOpenByDefault={isOpenByDefault}
        onBlur={onBlur}
        onChange={onChange}
        onSelect={onSelect}
      />
    );
  }
);

export default TimePicker;
