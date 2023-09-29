import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { addPositionAndWidth } from '@commons/models/DailySummary/BaseEvent';

import { State } from '../modules';

import Calendar from '../components/Calendar';

import { isAllDayEvent } from '../helper';

const CalendarContainer = () => {
  const events = useSelector(
    (state: State) => state.entities.events.records,
    shallowEqual
  );

  const date = useSelector((state: State) => state.ui.dailySummary.targetDate);

  const normalEvents = React.useMemo(() => {
    const filtered = events.filter((event) => !isAllDayEvent(event));
    return addPositionAndWidth(filtered, 235);
  }, [events]);

  const allDayEvents = React.useMemo(() => {
    return events.filter((event) => isAllDayEvent(event));
  }, [events]);

  const allDayEventsCount = React.useMemo(() => {
    const { length } = allDayEvents;
    return length > 3 ? 4 : length;
  }, [allDayEvents]);

  return (
    <Calendar
      normalEvents={normalEvents}
      allDayEvents={allDayEvents}
      allDayEventsCount={allDayEventsCount}
      scrollTo={7}
      targetDate={date}
    />
  );
};

export default CalendarContainer;
