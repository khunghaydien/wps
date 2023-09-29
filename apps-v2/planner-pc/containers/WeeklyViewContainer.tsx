import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResizeDetector from 'react-resize-detector';

import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

import { MAX_ALL_DAY_EVENT } from '../constants/calendar';
import eventTemplate from '../constants/eventTemplate';

import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

import { State } from '../modules';
import { EventViewModel } from '../modules/entities/events';

import Calendar from '../action-dispatchers/Calendar';

import WeeklyView from '../components/WeeklyView';
import AllDayEvents from '../components/WeeklyView/AllDayEvents';
import WeeklyCalendar from '../components/WeeklyView/WeeklyCalendar';

import {
  addPositionAndWidth,
  bundleByDay,
  calculatePopupPosition,
  filterByWeek,
  makeAllDayEventLayout,
  orderEventsOfDay,
} from '../helpers';
import { onClickEventAdapter } from '../helpers/EventAdapter';
import { Ui } from '../styles';

const ReactResizeDetector = ResizeDetector as React.ComponentType<
  React.ComponentProps<typeof ResizeDetector> & {
    children: (...props: unknown[]) => ReactElement;
  }
>;

type Props = {
  today?: Date;
  openEventEdit: (
    calendarEvent: CalendarEvent,
    syntheticEvent: React.SyntheticEvent
  ) => void;
};

const mapStateToProps = (state: State) => ({
  events: state.entities.events,
  selectedDay: state.selectedDay,
});

const WeeklyViewContainer: React.FC<Props> = ({
  openEventEdit,
  today = new Date(),
}: Props) => {
  const props = useSelector(mapStateToProps);
  const userSetting = useSelector((state: State) => state.userSetting);

  const dispatch = useDispatch();
  const calendar = Calendar(userSetting, dispatch);

  const todayDateOnly = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    /* todayは実行の都度生成されるのでuseMemoのdepsには不適格 */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [today.getFullYear(), today.getMonth(), today.getDate()]
  );

  const [width, setWidth] = useState(0);
  const [layoutAdjustedEventsByDay, setLayoutAdjustedEventsByDay] = useState<
    readonly (readonly EventViewModel[])[]
  >([]);
  // TODO 下記は設定から取得する
  const startDayOfTheWeek = 0;

  const onMeasure = useCallback((contentWidth) => {
    setWidth((contentWidth - 55) / 7 - 9);
  }, []);

  // TODO
  // Remove this callback.
  //
  // This callback was added for backward compatibility.
  // In the near future, this callback is going to be removed with EventEditPopup
  const onClickOpenEvent = useCallback(
    onClickEventAdapter(props.events as any, openEventEdit),
    [openEventEdit, props.events]
  );

  const onClickNewEvent = useCallback(
    (time: moment.Moment, event: React.MouseEvent, isAllDay = false) => {
      const { nativeEvent, currentTarget } = event;
      const selectedEvent = cloneDeep(eventTemplate);
      const start = time.clone();
      selectedEvent.start = start;
      selectedEvent.end = start.clone();
      selectedEvent.isAllDay = isAllDay;
      if (!isAllDay) {
        selectedEvent.end = start.clone().add(1, 'hours');
        // Divide the element and add 30 minutes if position of ClickEvent is lower
        if (nativeEvent.offsetY > currentTarget.clientHeight / 2) {
          selectedEvent.start = selectedEvent.start.add(30, 'minutes');
          selectedEvent.end = selectedEvent.end.add(30, 'minutes');
        }
      }
      openEventEdit(selectedEvent, event);
    },
    []
  );

  const onClickOpenEventList = useCallback(
    (clickedDate: Date, e: React.MouseEvent) => {
      // Manually firing blur event is needed here since Keyboard Event does not provide positions.
      // If it were not, Event List is displayed at (0,0) of screen.
      // @ts-ignore FIXME Specify a proper type to currentTarget
      e.currentTarget.blur();

      const { top, left } = calculatePopupPosition(
        Ui.eventList.height,
        Ui.eventList.width,
        e
      );
      calendar.openEventList(clickedDate, top, left);
    },
    [dispatch]
  );

  const startDate = useMemo(() => {
    let date = props.selectedDay.clone().day(startDayOfTheWeek);
    if (date.isAfter(props.selectedDay)) {
      date = props.selectedDay.clone().add(-1, 'w').day(startDayOfTheWeek);
    }
    return date;
  }, [props.selectedDay]);

  const weekDates = useMemo(
    () =>
      [...Array(7).keys()].reduce((acc: Array<Date>, date) => {
        const converted = startDate.toDate();
        converted.setDate(converted.getDate() + date);
        acc.push(converted);
        return acc;
      }, []),
    [startDate]
  );

  const [dayEvents, allDayEvents, allDayEventLayouts, allDayEventsByDay] =
    useMemo(() => {
      const filteredEvents = filterByWeek(props.events, weekDates);
      const orderedEvents = orderEventsOfDay(filteredEvents);
      const lessThanDayEvents = orderedEvents.filter(
        (event) => event.isLessThanDay
      );
      const allDay = orderedEvents.filter((event) => !event.isLessThanDay);

      const allDayLayouts = makeAllDayEventLayout(filteredEvents);
      const eventsByDay = bundleByDay(lessThanDayEvents);

      const allDayEventsByDay = bundleByDay(allDay);
      for (const events of eventsByDay) {
        addPositionAndWidth([...events], width);
      }

      setLayoutAdjustedEventsByDay(eventsByDay);

      return [eventsByDay, allDay, allDayLayouts, allDayEventsByDay];
    }, [props.events, weekDates]);

  const allDayEventMaxRow = useMemo(() => {
    const counts = Object.keys(allDayEventLayouts).map(
      (val) => allDayEventLayouts[val]
    );
    if (counts.length <= 0) {
      return 0;
    }

    // have to + 1 because The first line of allDayEventLayouts is treated as 0
    let maxRow = Math.max(...counts) + 1;
    maxRow = maxRow > MAX_ALL_DAY_EVENT ? MAX_ALL_DAY_EVENT + 1 : maxRow;
    return maxRow;
  }, [allDayEventLayouts]);

  useEffect(() => {
    const eventsByDay = [];
    for (const events of dayEvents) {
      eventsByDay.push(addPositionAndWidth([...events], width));
    }
    setLayoutAdjustedEventsByDay(eventsByDay);
  }, [dayEvents, width]);

  return (
    <ReactResizeDetector handleWidth onResize={onMeasure}>
      {({ measureRef }): ReactElement => (
        <WeeklyView ref={measureRef}>
          <AllDayEvents
            today={todayDateOnly}
            useWorkTime={userSetting.useWorkTime}
            weekDates={weekDates}
            allDayEvents={allDayEvents}
            allDayEventLayouts={allDayEventLayouts}
            allDayEventsByDay={allDayEventsByDay}
            allDayEventMaxRow={allDayEventMaxRow}
            onClickNewEvent={onClickNewEvent}
            onClickOpenEvent={onClickOpenEvent}
            onClickOpenEventList={onClickOpenEventList}
          />
          <WeeklyCalendar
            today={today}
            weekDates={weekDates}
            dayEvents={layoutAdjustedEventsByDay}
            allDayEventMaxRow={allDayEventMaxRow}
            onClickNewEvent={onClickNewEvent}
            onClickOpenEvent={onClickOpenEvent}
          />
        </WeeklyView>
      )}
    </ReactResizeDetector>
  );
};

export default WeeklyViewContainer;
