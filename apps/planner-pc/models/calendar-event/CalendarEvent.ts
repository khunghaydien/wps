import orderBy from 'lodash/orderBy';
import moment from 'moment';

import { DATETIME_FORMAT_FOR_EVENT_DATA_KEY } from '../../constants/event';

import { Event } from '../../../domain/models/time-management/Event';

import { BaseEvent } from './BaseEvent';

export type CalendarEvent = {
  layout: {
    startMinutesOfDay: number;
    endMinutesOfDay: number;
    containsAllDay: boolean;
    colSpan: number;
    colIndex: number;
    visibleInMonthlyView: boolean;
  };
} & BaseEvent;

export type CalendarEventMap = {
  [K in string]: CalendarEvent[];
};

/**
 * 予定が「終日」かをチェックする
 * @param {object} event
 */
const doesContainAllDay = (event: Event): boolean => {
  if (event.isAllDay) {
    // NOTE: 終日チェックがされている場合
    return true;
  }
  const eventStart = moment(event.startDateTime);
  const eventEnd = moment(event.endDateTime);
  const diff = eventEnd.diff(eventStart, 'minutes');
  if (diff >= 1440) {
    // NOTE: 24時間以上の場合
    return true;
  }
  return false;
};

const getColIndex = (
  startDayOfTheWeek: number,
  targetDayOfTheWeek: number
): number => {
  if (targetDayOfTheWeek >= startDayOfTheWeek) {
    return targetDayOfTheWeek - startDayOfTheWeek;
  }
  return 7 - startDayOfTheWeek + targetDayOfTheWeek;
};

const getColSpan = (
  startDayOfTheWeek: number,
  startDate: moment.Moment,
  eventEnd: moment.Moment
): number => {
  const colIndex = getColIndex(startDayOfTheWeek, startDate.day());
  const maxColSpan = 7 - colIndex;
  let colSpan = eventEnd.diff(startDate, 'days') + 1;
  /**
   * If the end date is 00:00:00 on the next day, the end date is not included as event.
   * e.g. if you have events between 2019/05/01 09:00:00 and 2019/05/25 00:00:00,
   * then 2019/05/01 ~ 2019/05/24 is events.
   */
  if (
    colSpan > 1 &&
    !eventEnd.isSame(startDate) &&
    eventEnd.hours() === 0 &&
    eventEnd.minutes() === 0 &&
    eventEnd.seconds() === 0
  ) {
    colSpan -= 1;
  }
  if (colSpan > maxColSpan) {
    colSpan = maxColSpan;
  }
  return colSpan;
};

// NOTE: カレンダー表示用の予定を生成する
const generateEvent = (
  map: CalendarEventMap,
  event: Event,
  startDate: moment.Moment,
  endDateOfTheWeek: moment.Moment,
  startDayOfTheWeek: number
): CalendarEventMap => {
  const eventStart = moment(event.startDateTime);
  const eventEnd = moment(event.endDateTime);
  const dateKey = startDate.format(DATETIME_FORMAT_FOR_EVENT_DATA_KEY);
  if (!map[dateKey]) {
    map[dateKey] = [];
  }

  const colIndex = getColIndex(startDayOfTheWeek, startDate.day());
  const containsAllDay = doesContainAllDay(event);
  let colSpan = getColSpan(startDayOfTheWeek, startDate, eventEnd);
  if (!containsAllDay) {
    colSpan = 1; // NOTE: 月ビューのときに必ず1日分として表示させる
  }

  let visibleInMonthlyView = true;
  let startMinutesOfDay = eventStart.hours() * 60 + eventStart.minutes();
  if (!eventStart.isSame(startDate, 'day') && !containsAllDay) {
    startMinutesOfDay = 0; // NOTE: 日またぎの予定のうち、後ろのものの表示開始時間を調整
    visibleInMonthlyView = false; // NOTE: 日またぎの予定のうち、後ろ側のものについては月ビューで表示させない
  }

  let endMinutesOfDay = eventEnd.hours() * 60 + eventEnd.minutes();
  if (!event.isAllDay) {
    if (endMinutesOfDay - startMinutesOfDay <= 30) {
      endMinutesOfDay = startMinutesOfDay + 30;
    } else if (endMinutesOfDay - startMinutesOfDay < 60) {
      endMinutesOfDay = startMinutesOfDay + 60;
    }
  }
  if (!eventEnd.isSame(startDate, 'day') && !containsAllDay) {
    endMinutesOfDay = 1440; // NOTE: 日またぎの予定のうち、前のものの表示終了時間を調整
  }

  // FIXME: GENIE-1653 で API の仕様が変更になり、Event の各項目を __c のまま返さなくなったため
  // 空文字への変換は不要になっているはず。確認の上削除する。
  const aCalendarEvent: CalendarEvent = {
    id: event.id,
    title: event.title || '',
    start: eventStart,
    end: eventEnd,
    isAllDay: event.isAllDay,
    calculateCapacity: event.calculateCapacity,
    isOrganizer: event.isOrganizer,
    isOuting: event.isOuting,
    location: event.location || '',
    remarks: event.description || '',
    createdServiceBy: event.createdServiceBy,
    externalEventId: event.externalEventId,
    job: {
      id: event.jobId !== undefined && event.jobId !== null ? event.jobId : '',
      name:
        event.jobName !== undefined && event.jobName !== null
          ? event.jobName
          : '',
      code:
        event.jobCode !== undefined && event.jobCode !== null
          ? event.jobCode
          : '',
    },
    workCategoryId: event.workCategoryId || '',
    workCategoryCode: event.workCategoryCode || '',
    workCategoryName: event.workCategoryName || '',
    layout: {
      // NOTE: レイアウト用に持たせる項目
      colSpan,
      colIndex,
      startMinutesOfDay,
      endMinutesOfDay,
      visibleInMonthlyView,
      containsAllDay,
    },
  };
  map[dateKey].push(aCalendarEvent);

  // NOTE: 2日にまたがる予定の2日目の予定データを生成する
  if (!eventEnd.isSame(startDate, 'day') && !containsAllDay) {
    startDate.add(1, 'days');
    endDateOfTheWeek.add(1, 'days'); // TODO: ここだけ週の最後という意味で使っていないので、要修正
    return generateEvent(
      map,
      event,
      startDate,
      endDateOfTheWeek,
      startDayOfTheWeek
    );
  }

  // NOTE: 週内で終わる場合は処理終了
  if (eventEnd.isSameOrBefore(endDateOfTheWeek, 'day')) {
    return map;
  }

  // NOTE: 翌週にまたがる予定をさらに生成する
  startDate.add(7 - colIndex, 'days');
  endDateOfTheWeek.add(7, 'days');
  return generateEvent(
    map,
    event,
    startDate,
    endDateOfTheWeek,
    startDayOfTheWeek
  );
};

export const convertEventsFromRemote = (
  events: Event[],
  startDayOfTheWeek: number
): CalendarEventMap => {
  // Stringデータを変換
  const convertedEvents = events.reduce((map, event) => {
    const start = moment(event.startDateTime);
    const startDate = moment(start.format('YYYY-MM-DD'));
    const startCol = getColIndex(startDayOfTheWeek, start.day());
    const endDateOfTheWeek = startDate.clone().add(6 - startCol, 'days');

    return generateEvent(
      map,
      event,
      startDate,
      endDateOfTheWeek,
      startDayOfTheWeek
    );
  }, {});

  /*
  NOTE: Order events by dates.
    1. Order by start date times ascending
    2. Then, order by end times descending (it means that the larger diff of start and end has priority.)
    3. Finally, if the order could not be decided, it orders events by title to guarantee the same order every time.

  NOTE: 日付ごとに格納された予定配列をソートする
    1. 開始日時が早いものを先にする
    2. 同じ開始日時のものについては期間が長いものを先にする
    3. 1,2で決まらない場合にはtitleで並べて同じ並び順を保証する
  */
  Object.keys(convertedEvents).forEach((key) => {
    function getActualEndDate(event): moment.Moment {
      let endDate = event.end.clone();
      if (event.isAllDay) {
        endDate = endDate.add(1, 'days'); // NOTE: 終日の場合は終了日の00:00になっているため1日ずらす
      }
      return endDate;
    }
    convertedEvents[key] = orderBy(
      convertedEvents[key] as CalendarEvent[],
      [
        (event): moment.Moment => event.start,
        (event): moment.Moment => getActualEndDate(event),
        (event): string => event.title,
      ],
      ['asc', 'desc', 'asc']
    );
  });

  return convertedEvents;
};

export default { convertEventsFromRemote };
