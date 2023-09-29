import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DateUtil from '../../commons/utils/DateUtil';

import { State } from '../modules';

import Calendar from '../action-dispatchers/Calendar';
import { switchCalendarMode } from '../actions/events';

import CalendarHeader from '../components/CalendarHeader';

const CalendarHeaderContainer: React.FC<Record<string, unknown>> = () => {
  const calendarMode = useSelector((state: State) => state.calendarMode);
  const selectedDay = useSelector((state: State) => state.selectedDay);
  const userSetting = useSelector((state: State) => state.userSetting);

  const dispatch = useDispatch();

  const date = useMemo(() => selectedDay.format('YYYY-MM'), [selectedDay]);
  const calendar = useMemo(
    () => Calendar(userSetting, dispatch),
    [userSetting, dispatch]
  );

  const onClickToday = useCallback(() => {
    calendar.goToday();
  }, [calendar]);

  const onClickNext = useCallback(() => {
    const current = selectedDay.toDate();
    if (calendarMode === 'month') {
      calendar.goNextMonth(current);
    } else {
      calendar.goNextWeek(current);
    }
  }, [calendar, dispatch, calendarMode, selectedDay]);

  const onClickPrevious = useCallback(() => {
    const current = selectedDay.toDate();
    if (calendarMode === 'month') {
      calendar.goPrevMonth(current);
    } else {
      calendar.goPrevWeek(current);
    }
  }, [calendar, dispatch, calendarMode, selectedDay]);

  const onSelectDate = useCallback<(arg0: { value: string }) => void>(
    ({ value }) => {
      calendar.goTargetDate(value, selectedDay.date());
    },
    [calendar, dispatch, selectedDay]
  );

  const onSelectCalendarMode = useCallback<
    (arg: { value: 'week' | 'month' }) => void
  >(
    ({ value }) => {
      dispatch(switchCalendarMode(value));
    },
    [dispatch, calendarMode]
  );

  const dateList = useMemo(() => {
    const list = [];
    for (let i = 12; i > -12; i--) {
      const month = selectedDay.clone().add(i, 'month');
      list.push({
        label: DateUtil.formatYLongM(month.format('YYYY-MM-DD')),
        value: month.format('YYYY-MM'),
      });
    }

    return list;
  }, [selectedDay, DateUtil.currentLang()]);

  return (
    <CalendarHeader
      onClickToday={onClickToday}
      onClickNext={onClickNext}
      onClickPrevious={onClickPrevious}
      onSelectDate={onSelectDate}
      onSelectCalendarMode={onSelectCalendarMode}
      dateList={dateList}
      date={date}
      calendarMode={calendarMode}
    />
  );
};

export default CalendarHeaderContainer;
