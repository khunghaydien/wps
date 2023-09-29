import * as React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import styled from 'styled-components';

import { Color } from '@apps/core/styles';
import DateUtil from '@commons/utils/DateUtil';

import './DatePicker.scss';

const Container = styled.div.attrs({
  className: 'attendance-ui-page-timesheet-pc-importer-date-picker',
})`
  display: inline-block;
  padding: 0;
  border: 0;
  width: 100%;
`;

const StyledInput = styled.input.attrs({
  type: 'text',
})`
  background: #fff;
  border: 1px solid ${Color.border3};
  padding: 6px 12px 6px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  resize: none;
  outline: none;
  overflow: auto;
  width: 100%;

  :focus,
  :active {
    border: 1px solid ${Color.accent};
    box-shadow: 0 0 3px #0070d2;
  }

  :read-only {
    border: 1px solid ${Color.bgDisabled};
    background: #eee;
    box-shadow: none;
  }

  :disabled {
    color: #999;
    border: 1px solid ${Color.bgDisabled};
    background: #eee;
    box-shadow: none;
  }

  ::placeholder {
    color: #999;
  }
`;

type StyledInputProps = React.ComponentProps<typeof StyledInput>;

const convertDateStringToLocationString = (value: string) =>
  DateUtil.formatYMD(value);
const convertToDateString = DateUtil.formatISO8601Date;
const convertStringToDate = (value: string) => {
  const date = new Date(DateUtil.formatISO8601Date(value));
  return Number.isNaN(new Date(date).getTime()) ? undefined : date;
};
const convertToLocationString = (
  value: Parameters<typeof convertToDateString>[0]
) => convertDateStringToLocationString(convertToDateString(value));

// eslint-disable-next-line react/display-name
const InnerInput = React.forwardRef<
  HTMLTextAreaElement,
  StyledInputProps & {
    onBlurInput: StyledInputProps['onBlur'];
    onFocusInput: StyledInputProps['onFocus'];
  }
>(({ onBlur, onFocus, onBlurInput, onFocusInput, ...props }, ref) => {
  const $onFocus = React.useCallback(
    (...args: Parameters<StyledInputProps['onFocus']>) => {
      if (onFocus) {
        onFocus(...args);
      }
      return onFocusInput(...args);
    },
    [onFocus, onFocusInput]
  );
  const $onBlur = React.useCallback(
    (...args: Parameters<StyledInputProps['onBlur']>) => {
      if (onBlur) {
        onBlur(...args);
      }
      return onBlurInput(...args);
    },
    [onBlur, onBlurInput]
  );
  return (
    <StyledInput
      {...props}
      inputRef={ref}
      onBlur={$onBlur}
      onFocus={$onFocus}
    />
  );
});

const DatePicker: React.FC<
  Omit<ReactDatePickerProps, 'onChange' | 'onBlur' | 'onFocus'> & {
    onChangeDate: (value: string) => void;
    // eslint-disable-next-line react/require-default-props
    onChange?: ReactDatePickerProps['onChange'];
    // eslint-disable-next-line react/require-default-props
    onBlur?: StyledInputProps['onBlur'];
    // eslint-disable-next-line react/require-default-props
    onFocus?: StyledInputProps['onFocus'];
  }
> = ({
  value,
  selected,
  onChangeDate,
  onChange,
  onChangeRaw,
  onFocus,
  onBlur,
  onCalendarClose,
  onCalendarOpen,
  ...props
}) => {
  const [opened, setOpened] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [$value, setValue] = React.useState<string>(
    convertDateStringToLocationString(value)
  );
  const [$selected, setSelected] = React.useState<Date>(selected);
  const update = React.useCallback(
    (date: Date) => {
      // 内部の値を更新しないと一瞬だけ別のロケールで更新されてしまう。
      setValue(convertToLocationString(date));
      // 内部の値を更新しないと一瞬だけ別のロケールで更新されてしまう。
      setSelected(date);
      onChangeDate(convertToDateString(date));
    },
    [onChangeDate]
  );
  const $onChange = React.useCallback(
    (...args: Parameters<ReactDatePickerProps['onChange']>) => {
      if (!focused) {
        // 入力の最中常に onChange が発生してしまうので抑止している。
        update(args[0]);
      }
      if (onChange) {
        return onChange(...args);
      }
    },
    [focused, onChange, update]
  );
  const $onChangeRaw = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value);
      if (onChangeRaw) {
        return onChangeRaw(event);
      }
    },
    [onChangeRaw]
  );
  const $onFocusInput = React.useCallback(
    (...args: Parameters<StyledInputProps['onFocus']>) => {
      setFocused(true);
      if (onFocus) {
        return onFocus(...args);
      }
    },
    [onFocus]
  );
  const $onBlurInput = React.useCallback(
    (...args: Parameters<StyledInputProps['onBlur']>) => {
      setFocused(false);
      if (!opened) {
        // カレンダーを選択して日付を選択するとカレンダーが閉じたまま Input に focus が戻る。
        // カレンダーが閉じて要る場合は、Input から focus が外れたタイミングで値を反映させる。
        update(convertStringToDate($value) || selected);
      }
      if (onBlur) {
        return onBlur(...args);
      }
    },
    [$value, onBlur, opened, selected, update]
  );
  const $onCalendarOpen = React.useCallback(
    (...args: Parameters<ReactDatePickerProps['onCalendarOpen']>) => {
      setOpened(true);
      if (onCalendarOpen) {
        return onCalendarOpen(...args);
      }
    },
    [onCalendarOpen]
  );
  const $onCalendarClose = React.useCallback(
    (...args: Parameters<ReactDatePickerProps['onCalendarClose']>) => {
      setOpened(false);
      setFocused(false);
      // Input 中は onChange をしないように抑止しているため、
      // Input に何かを入力済みのままカレンダーへ移動すると
      // カレンダーを閉じても onChange が発生しないままなので更新を手動で呼び出している。
      update(convertStringToDate($value) || selected);
      if (onCalendarClose) {
        return onCalendarClose(...args);
      }
    },
    [$value, onCalendarClose, selected, update]
  );

  React.useEffect(() => {
    setValue(convertDateStringToLocationString(value));
  }, [value]);

  React.useEffect(() => {
    setSelected(selected);
  }, [selected]);

  return (
    <Container>
      <ReactDatePicker
        {...{
          ...props,
          value: $value,
          selected: $selected,
          customInput: (
            <InnerInput
              // カレンダーに focus が移動すると onBlur が発生しない。
              // Input の中なのかを正確に知りたいのでイベントを設定している。
              // 通常の onFocus, onBlur は内部で上書きされるので別名でさらに上書きした。
              onFocusInput={$onFocusInput}
              onBlurInput={$onBlurInput}
              resize="none"
              minRows={1}
              maxRows={1}
            />
          ),
          onChange: $onChange,
          onChangeRaw: $onChangeRaw,
          onCalendarOpen: $onCalendarOpen,
          onCalendarClose: $onCalendarClose,
        }}
      />
    </Container>
  );
};

export default DatePicker;
