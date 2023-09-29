import React from 'react';
import ReactDatePicker, {
  ReactDatePickerProps as OriginalReactDatePickerProps,
} from 'react-datepicker';

import moment from 'moment';

import styled from 'styled-components';

import { useKey } from '../../hooks';
import { Calendar } from '../Icons';
import { useCallbackWithMoment, useTempValue } from './hooks';

import 'react-datepicker/dist/react-datepicker.css';

type ReactDatePickerProps = Omit<
  OriginalReactDatePickerProps,
  | 'onChange'
  | 'onMonthChange'
  | 'onYearChange'
  | 'onSelect'
  | 'onWeekSelect'
  | 'selected'
  | 'maxDate'
  | 'minDate'
>;

interface Props extends ReactDatePickerProps {
  /**
   * An event handler invoked on changed selected date.
   * @param {null | Date} date - Selected date
   */
  onChange?: (date: null | Date) => void;

  /**
   * An event handler invoked on changed selected month.
   * @param {Date} date - Date object for the selected month.
   */
  onMonthChange?: (date: null | Date) => void;

  /**
   * An event handler invoked on changed selected year.
   * @param {Date} date - Date object for the selected year.
   */
  onYearChange?: (date: null | Date) => void;

  /**
   * An event handler invoked on selecting date in calendar UI.
   * @param {Date} date - Date object for the selected date in calendar UI.
   */
  onSelect?: (date: null | Date) => void;

  /**
   * An event handler invoked on selecting week in calendar UI.
   * @param {Date} date - Date object for the selected week in calendar UI.
   */
  onWeekSelect?: (date: null | Date) => void;

  /**
   * Show calendar icon inside input element.
   */
  showsIcon?: boolean;

  /**
   * Selected date
   */
  selected?: Date;

  /**
   * The selectable maximum date of calendar ui
   */
  maxDate?: Date;

  /**
   * The Selectable minimum date of calendar ui
   */
  minDate?: Date;
}

const StyledDatePicker = styled(ReactDatePicker)`
  width: 100%;
  height: 32px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 13px;
  line-height: 17px;
  cursor: pointer;
`;

const S = {
  InputWrapper: styled.div`
    position: relative;
    width: 100%;
    height: 100%;
  `,
  IconWrapper: styled.div`
    position: absolute;
    right: 12px;
    top: 5px;
  `,
};

const CustomInput = React.forwardRef((props: any, ref) => {
  const inputKey = useKey();
  const iconKey = useKey();
  return (
    <S.InputWrapper>
      <input key={inputKey} {...props} ref={ref} />
      <S.IconWrapper key={iconKey}>
        <Calendar color="disable" />
      </S.IconWrapper>
    </S.InputWrapper>
  );
});

const DatePicker: React.FC<Props> = (props: Props) => {
  const onChange = useCallbackWithMoment(props.onChange);
  const onMonthChange = useCallbackWithMoment(props.onMonthChange);
  const onYearChange = useCallbackWithMoment(props.onYearChange);
  const onSelect = useCallbackWithMoment(props.onSelect);
  const onWeekSelect = useCallbackWithMoment(props.onWeekSelect);
  const [tempValue, onChangeRaw, onBlur] = useTempValue(
    props.value || '',
    onChange
  );

  const selected = React.useMemo(
    () => props.selected && moment(props.selected),
    [props.selected]
  );

  const maxDate = React.useMemo(
    () => props.maxDate && moment(props.maxDate),
    [props.maxDate]
  );

  const minDate = React.useMemo(
    () => props.minDate && moment(props.minDate),
    [props.minDate]
  );

  return (
    // Remove @ts-ignore after upgrading react-datepicker
    // @ts-ignore
    <StyledDatePicker
      customInput={props.showsIcon ? <CustomInput /> : undefined}
      dateFormatCalendar="MMMM"
      showYearDropdown
      onBlur={onBlur}
      onChangeRaw={onChangeRaw}
      {...props}
      value={tempValue}
      selected={selected}
      maxDate={maxDate}
      minDate={minDate}
      onChange={onChange}
      onMonthChange={onMonthChange}
      onYearChange={onYearChange}
      onSelect={onSelect}
      onWeekSelect={onWeekSelect}
    />
  );
};

DatePicker.defaultProps = {
  showsIcon: true,
};

export default DatePicker;
