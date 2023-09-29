import * as React from 'react';

import { isValid } from 'date-fns';
import moment from 'moment';

import styled from 'styled-components';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import { CheckBox, DatePicker } from '../../../../../core';

import RangeMark from '../../../images/rangeMark.svg';

type Diff<T, U> = T extends U ? never : T;
type $Diff<T, U> = Pick<T, Diff<keyof T, keyof U>>;

type DatePickerProps = $Diff<
  React.ComponentProps<typeof DatePicker>,
  {
    onChange: (date: Date) => void;
  }
>;

type DateFieldProps = Omit<
  DatePickerProps,
  'selected' | 'maxDate' | 'minDate' | 'onChange'
> & {
  selected?: string;
  maxDate?: string;
  minDate?: string;
  onChange: (value: string) => void;
};

type Props = Readonly<{
  startDateFieldProps: DateFieldProps;
  endDateFieldProps: DateFieldProps;
  onChangeHasRange: (arg0: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  hasRange?: boolean;
}>;

const S = {
  DateRangeFieldContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  DateField: styled(DatePicker)`
    width: 174px;

    :disabled,
    :disabled:active,
    :disabled:hover {
      background-color: #eee;
    }
  `,
  CheckBoxContainer: styled.div`
    display: flex;
    margin-top: 8px;
  `,
  SeparationContainer: styled.div`
    display: flex;
    flex: 0;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-right: 7px;
    margin-left: 7px;
  `,
};

const useTempDateTime = (date: string): [string, (value: string) => void] => {
  const [tempDate, setTempDate] = React.useState('');

  React.useEffect(() => {
    let formatted = '';
    if (date && isValid(new Date(date))) {
      formatted = DateUtil.formatYMD(date);
    } else {
      setTempDate('');
    }
    setTempDate(formatted);
  }, [date]);

  const onChangeTempDate = React.useCallback(
    (value: string) => {
      setTempDate(value);
    },
    [setTempDate]
  );

  return [tempDate, onChangeTempDate];
};

const DateRangeField = ({
  startDateFieldProps,
  endDateFieldProps,
  ...props
}: Props) => {
  const {
    value: valueOfStartDateField,
    selected: selectedOfStartDateField,
    maxDate: maxDateOfStartDateField,
    required: requiredOfStartDateField,
    disabled: disabledOfStartDateField,
    showsIcon: showsIconOfStartDateField,
    onChange: onChangeStartDateField,
  } = startDateFieldProps;

  const {
    value: valueOfEndDateField,
    selected: selectedOfEndDateField,
    minDate: minDateOfStartDateField,
    required: requiredOfEndDateField,
    disabled: disabledOfEndDateField,
    showsIcon: showsIconOfEndDateField,
    onChange: onChangeEndDateField,
  } = endDateFieldProps;

  const [tempStartDate, onChangeRawStartDate] = useTempDateTime(
    valueOfStartDateField || ''
  );

  const [tempEndDate, onChangeRawEndDate] = useTempDateTime(
    valueOfEndDateField || ''
  );

  const onChangeDate = React.useCallback(
    (
        onChange: (m: string) => void,
        onChangeTempDate: (value: string) => void
      ) =>
      (d: null | Date) => {
        if (d) {
          onChange(moment(d).format('YYYY-MM-DD'));
        } else {
          onChangeTempDate('');
        }
      },
    []
  );

  const onBlurDate = React.useCallback(
    (
        onChange: (m: string) => void,
        onChangeTempDate: (e: string) => void,
        originValue: string
      ) =>
      (e: React.SyntheticEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        if (moment(value).isValid()) {
          onChange(moment(value).format('YYYY-MM-DD'));
        } else {
          const formatted = DateUtil.formatYMD(originValue);
          onChangeTempDate(formatted);
        }
      },
    []
  );

  return (
    <>
      {props.hasRange ? (
        <S.DateRangeFieldContainer>
          <S.DateField
            onChange={onChangeDate(
              onChangeStartDateField,
              onChangeRawStartDate
            )}
            onChangeRaw={(e) => onChangeRawStartDate(e.target.value)}
            onBlur={onBlurDate(
              onChangeStartDateField,
              onChangeRawStartDate,
              valueOfStartDateField || ''
            )}
            value={tempStartDate}
            selected={
              selectedOfStartDateField
                ? new Date(selectedOfStartDateField)
                : new Date(tempStartDate)
            }
            maxDate={
              maxDateOfStartDateField
                ? new Date(maxDateOfStartDateField)
                : new Date(tempStartDate)
            }
            required={props.required || requiredOfStartDateField}
            disabled={props.disabled || disabledOfStartDateField}
            showsIcon={showsIconOfStartDateField}
          />

          <S.SeparationContainer>
            <RangeMark />
          </S.SeparationContainer>

          <S.DateField
            onChange={onChangeDate(onChangeEndDateField, onChangeRawEndDate)}
            onChangeRaw={(e) => onChangeRawEndDate(e.target.value)}
            onBlur={onBlurDate(
              onChangeEndDateField,
              onChangeRawEndDate,
              valueOfEndDateField || ''
            )}
            value={tempEndDate}
            selected={
              selectedOfEndDateField
                ? new Date(selectedOfEndDateField)
                : new Date(tempEndDate)
            }
            minDate={
              minDateOfStartDateField
                ? new Date(minDateOfStartDateField)
                : new Date(tempEndDate)
            }
            required={props.required || requiredOfEndDateField}
            disabled={props.disabled || disabledOfEndDateField}
            showsIcon={showsIconOfEndDateField}
          />
        </S.DateRangeFieldContainer>
      ) : (
        <S.DateField
          onChange={onChangeDate(onChangeStartDateField, onChangeRawStartDate)}
          onChangeRaw={(e) => onChangeRawStartDate(e.target.value)}
          onBlur={onBlurDate(
            onChangeStartDateField,
            onChangeRawStartDate,
            valueOfStartDateField || ''
          )}
          value={tempStartDate}
          selected={
            selectedOfStartDateField
              ? new Date(selectedOfStartDateField)
              : new Date(tempStartDate)
          }
          maxDate={
            maxDateOfStartDateField
              ? new Date(maxDateOfStartDateField)
              : new Date(tempStartDate)
          }
          required={props.required || requiredOfStartDateField}
          disabled={props.disabled || disabledOfStartDateField}
          showsIcon={showsIconOfStartDateField}
        />
      )}
      <S.CheckBoxContainer>
        <CheckBox
          checked={props.hasRange || false}
          disabled={props.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.onChangeHasRange(e.target.checked)
          }
        >
          {msg().Att_Lbl_UsePeriod}
        </CheckBox>
      </S.CheckBoxContainer>
    </>
  );
};

export default DateRangeField;
