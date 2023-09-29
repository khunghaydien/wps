import * as React from 'react';

import { isValid } from 'date-fns';
import moment from 'moment';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import CalendarUtil from '../../../commons/utils/CalendarUtil';
import { CheckBox, DatePicker, Text, TimePicker } from '../../../core';

import { BaseEvent } from '../../models/calendar-event/BaseEvent';

type Props = Readonly<{
  onChange: (
    key: keyof BaseEvent,
    value: string | boolean | moment.Moment
  ) => void;
  event: BaseEvent;
}>;

const S = {
  EventDate: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
  `,
  Text: styled(Text)`
    line-height: 17px;
  `,
  StartDatePicker: styled(DatePicker)`
    width: 108px;
    margin: 0 8px 0 20px;
  `,
  StartTimePicker: styled(TimePicker)`
    margin-right: 8px;
  `,
  EndDatePicker: styled(DatePicker)`
    width: 108px;
    margin-left: 8px;
  `,
  EndTimePicker: styled(TimePicker)`
    margin-left: 8px;
  `,
};

const useTempDateTime = (
  date: moment.Moment | null,
  formatOptions = { dateStyle: 'medium' }
): [string, (value: string) => void] => {
  const [tempDate, setTempDate] = React.useState('');

  React.useEffect(() => {
    let formated = '';
    if (date && isValid(date.toDate())) {
      formated = CalendarUtil.format(
        new Date(date.toDate()),
        formatOptions as Intl.DateTimeFormatOptions
      );
    }
    setTempDate(formated);
  }, [date]);

  const onChangeTempDate = React.useCallback(
    (value: string) => {
      setTempDate(value);
    },
    [setTempDate]
  );

  return [tempDate, onChangeTempDate];
};

const EventDate: React.ComponentType<Props> = React.memo(
  ({ event, onChange }: Props) => {
    const [tempStartDate, onChangeRawStartDate] = useTempDateTime(event.start);
    const [tempEndDate, onChangeRawEndDate] = useTempDateTime(event.end);

    const onChangeDateOf = React.useCallback(
      (key: 'start' | 'end') =>
        (d: null | Date): void => {
          if (d) {
            const time = event[key].format('HH:mm');
            const m = moment(d);
            onChange(key, moment(`${m.format('YYYY-MM-DD')} ${time}`));
          }
        },
      [onChange, event]
    );

    const onBlurDateOf = React.useCallback(
      (
          key: 'start' | 'end',
          onChangeTempDate: (e: string) => void,
          formatOptions: Intl.DateTimeFormatOptions = {}
        ) =>
        (e: React.SyntheticEvent<HTMLInputElement>): void => {
          const time = event[key].format('HH:mm');
          const { value } = e.currentTarget;
          if (moment(`${value} ${time}`).isValid()) {
            onChangeDateOf(key)(moment(value).toDate());
          } else {
            const formated = CalendarUtil.format(
              event[key].toDate(),
              formatOptions
            );
            onChangeTempDate(formated);
          }
        },
      [onChangeDateOf]
    );

    const startTime = React.useMemo(() => {
      return event.start ? event.start.clone().format('HH:mm') : '';
    }, [event.start]);
    const endTime = React.useMemo(() => {
      return event.end ? event.end.clone().format('HH:mm') : '';
    }, [event.end]);

    const onChangeTimeOf =
      (key: 'start' | 'end') =>
      (value: string): void => {
        onChange(key, moment(`${event[key].format('YYYY-MM-DD')} ${value}`));
      };

    return (
      <S.EventDate>
        <CheckBox
          data-testid="event-edit-popup__all-day"
          checked={event.isAllDay}
          onChange={(e): void => onChange('isAllDay', e.target.checked)}
        >
          <S.Text>{msg().Cal_Lbl_AllDay}</S.Text>
        </CheckBox>
        <S.StartDatePicker
          value={tempStartDate}
          onSelect={onChangeDateOf('start')}
          onChangeRaw={(e): void => onChangeRawStartDate(e.target.value)}
          onBlur={onBlurDateOf('start', onChangeRawStartDate)}
          selected={
            /* eslint-disable-line prettier/prettier */ event.start?.toDate()
          }
          showsIcon={false}
        />
        {!event.isAllDay && (
          <S.StartTimePicker
            value={startTime}
            onSelect={onChangeTimeOf('start')}
          />
        )}
        <Text>-</Text>
        <S.EndDatePicker
          value={tempEndDate}
          onSelect={onChangeDateOf('end')}
          onChangeRaw={(e): void => onChangeRawEndDate(e.target.value)}
          onBlur={onBlurDateOf('end', onChangeRawEndDate)}
          selected={
            /* eslint-disable-line prettier/prettier */ event.end?.toDate()
          }
          showsIcon={false}
        />
        {!event.isAllDay && (
          <S.EndTimePicker value={endTime} onSelect={onChangeTimeOf('end')} />
        )}
      </S.EventDate>
    );
  }
);

export default EventDate;
