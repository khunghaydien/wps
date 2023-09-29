import { eachDay } from 'date-fns';
import _ from 'lodash';
import filter from 'lodash/fp/filter';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import head from 'lodash/fp/head';
import orderBy from 'lodash/orderBy';

import { HOURS_HEIGHT_ON_WEEKLY_CALENDAR } from '../constants/calendar';

import CalendarUtil from '../../commons/utils/CalendarUtil';

import {
  EventViewModel,
  State as EventMap,
  toKey,
} from '../modules/entities/events';

export const filterByWeek = (
  events: EventMap,
  weekDates: ReadonlyArray<Date>
): ReadonlyArray<EventViewModel> => {
  return flow(
    flatMap((date: Date) => events[toKey(date)]),
    filter((e) => !_.isNil(e))
  )([...weekDates]);
};

export const isVisibleAllDayEvent = (event: EventViewModel): boolean => {
  return (
    CalendarUtil.isSameDate(event.date, event.startDateTimeOfWeek) &&
    ((event.isOverMultipleDays && !event.isLessThanDay) || event.isAllDay)
  );
};

export const orderEventsOfDay = (
  events: ReadonlyArray<EventViewModel>
): ReadonlyArray<EventViewModel> => {
  const [lessThanDay, oneOrMoreDays] = _.partition(
    events,
    (e) => e.isLessThanDay
  );
  return [
    ...orderBy(
      oneOrMoreDays,
      [
        ({ periodOfWeek }): number => periodOfWeek,
        ({ startDateTime }): Date => startDateTime,
        ({ title }): string => (title || '').toLocaleLowerCase(),
      ],
      ['desc', 'asc', 'asc']
    ),
    ...orderBy(
      lessThanDay,
      [
        ({ startDateTime }): Date => startDateTime,
        ({ minutes }): number => minutes,
        ({ title }): string => (title || '').toLocaleLowerCase(),
      ],
      ['asc', 'desc', 'asc']
    ),
  ];
};

export const makeAllDayEventLayout = (
  events: ReadonlyArray<EventViewModel>
): {
  [K in string]: number;
} => {
  const orderedEvents = orderEventsOfDay(filter(isVisibleAllDayEvent, events));

  const table = orderedEvents.map((_e, index) => ({
    level: index,
    [CalendarUtil.Day.Sunday]: true,
    [CalendarUtil.Day.Monday]: true,
    [CalendarUtil.Day.Tuesday]: true,
    [CalendarUtil.Day.Wednesday]: true,
    [CalendarUtil.Day.Thursday]: true,
    [CalendarUtil.Day.Friday]: true,
    [CalendarUtil.Day.Saturday]: true,
  }));

  const allocatedSlots = {};
  for (const event of orderedEvents) {
    const days = eachDay(
      event.startDateTimeOfWeek,
      event.endDateTimeOfWeek
    ).map((date) => date.getDay());

    const found = flow(
      filter((record: { [p: number]: boolean; level: number }) =>
        days.every((day) => record[day])
      ),
      head
    )(table);
    if (found) {
      allocatedSlots[event.id] = found.level;
      for (const day of days) {
        found[day] = false;
      }
    }
  }

  return allocatedSlots;
};

export const countInvisibleEvents = (
  events: ReadonlyArray<EventViewModel> = []
): number => {
  return filter(
    (event) => !(event.isOverMultipleDays && !event.isLessThanDay),
    events
  ).length;
};
export const doesHiddenEventsExist = (
  events: ReadonlyArray<EventViewModel> = [],
  layout: {
    [K in string]: number;
  },
  visibleEventNumber: number
): boolean => {
  return (
    events.some((event) => layout[event.id] >= visibleEventNumber) ||
    events.some((e) => e.isLessThanDay)
  );
};

export const bundleByDay = (
  events: ReadonlyArray<EventViewModel>
): ReadonlyArray<ReadonlyArray<EventViewModel>> => {
  return events.reduce(
    (acc, event) => {
      const bundledByDay = acc[event.date.getDay()];
      acc[event.date.getDay()] = [...bundledByDay, event];
      return acc;
    },
    [...Array(7)].map(() => [])
  );
};

export const calculatePopupPosition = (
  popupHeight: number,
  popupWidth: number,
  { pageX, pageY }: React.MouseEvent,
  containerClassName = 'ts-container'
): {
  top: number;
  left: number;
} => {
  const container = document.getElementsByClassName(containerClassName)[0];
  const [h, w] = [popupHeight / 2, popupWidth / 2];
  const { bottom, left } = container.getBoundingClientRect();
  const { pageYOffset } = window;

  const absPosY = pageY + pageYOffset + container.scrollTop;
  const absPosX = pageX - w;

  const popupTop = bottom - h < absPosY ? absPosY - popupHeight : absPosY - h;
  const popupLeft = left + w > absPosX ? absPosX + w : absPosX;

  return { top: popupTop, left: popupLeft };
};

// 破壊的関数 別チケットでリファクタリングし、安全な関数にする
const calculatePositionAndWidth = (
  columns: EventViewModel[][],
  width: number
): void => {
  const n = columns.length;

  for (let i = 0; i < n; i++) {
    const col = columns[i];
    for (let j = 0; j < col.length; j++) {
      const eventBox = col[j];
      // @ts-ignore
      eventBox.left = i * (width / n);
      // @ts-ignore
      eventBox.width = width / n;
    }
  }
};

const collidesWith = (a: EventViewModel, b: EventViewModel): boolean => {
  return (
    a.elapsedMinutesOfEndDateTime >= b.elapsedMinutesOfStartDateTime &&
    a.elapsedMinutesOfStartDateTime <= b.elapsedMinutesOfEndDateTime
  );
};

export const addPositionAndWidth = (
  events: EventViewModel[],
  width: number
): EventViewModel[] => {
  if (!events) {
    return [];
  }
  let columns = [];
  let lastEventEnding = null;

  const eventLength = events.length;
  for (let i = 0; i < eventLength; i++) {
    if (events[i].isLessThanDay) {
      // NOTE: 終日枠に表示させる予定は無視する
      if (
        lastEventEnding !== null &&
        events[i].elapsedMinutesOfStartDateTime >= lastEventEnding
      ) {
        calculatePositionAndWidth(columns, width);
        columns = [];
        lastEventEnding = null;
      }

      let placed = false;
      for (let j = 0; j < columns.length; j++) {
        const col = columns[j];
        if (!collidesWith(col[col.length - 1], events[i])) {
          col.push(events[i]);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([events[i]]);
      }
      if (
        lastEventEnding === null ||
        events[i].elapsedMinutesOfEndDateTime >= lastEventEnding
      ) {
        lastEventEnding = events[i].elapsedMinutesOfEndDateTime;
      }
    }
  }
  if (columns.length > 0) {
    calculatePositionAndWidth(columns, width);
  }
  return events;
};

export const toClosestToWeeklyCalendarsMinutes = (minutes: number): number =>
  minutes * (HOURS_HEIGHT_ON_WEEKLY_CALENDAR / 60);
