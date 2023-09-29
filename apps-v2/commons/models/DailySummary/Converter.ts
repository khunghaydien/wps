import _ from 'lodash';
import flatten from 'lodash/flatten';
import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';
import uniqBy from 'lodash/fp/uniqBy';
import isNil from 'lodash/isNil';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

import { Event } from '../../../domain/models/time-management/Event';

import { BaseEvent } from './BaseEvent';

const calcDailySummary = (number: number): number => {
  // 50 is the height of the daily summary calendar per hour.
  return (number / 60) * 50;
};

// デイリーサマリー表示時の座標調整
const modPosForDailySummary = (events: BaseEvent[]): BaseEvent[] => {
  return events.map((event) => {
    const newLayout = _.cloneDeep(event.layout);

    newLayout.startMinutesOfDay = calcDailySummary(newLayout.startMinutesOfDay);
    newLayout.endMinutesOfDay = calcDailySummary(newLayout.endMinutesOfDay);

    event.layout = newLayout;

    return event;
  });
};

/**
 * 予定が「終日」かをチェックする
 * @param {object} event
 */
const doesContainAllDay = (
  event: Event,
  targetDate: moment.Moment
): boolean => {
  if (event.isAllDay) {
    // NOTE: 終日チェックがされている場合
    return true;
  }

  const eventStart = moment(event.startDateTime);
  const eventEnd = moment(event.endDateTime);

  return (
    targetDate.startOf('date').isBetween(eventStart, eventEnd, null, '[]') &&
    targetDate.endOf('date').isBetween(eventStart, eventEnd, null, '[]')
  );
};

// NOTE: カレンダー表示用の予定を生成する
const generateEvent = (
  map: {
    [dateKey: string]: BaseEvent[];
  },
  event: Event,
  startDate: moment.Moment
): {
  [dateKey: string]: BaseEvent[];
} => {
  const eventStart = moment(event.startDateTime);
  const eventEnd = moment(event.endDateTime);

  const dateKey = startDate.format('YYYYMMDD');
  if (!map[dateKey]) {
    map[dateKey] = [];
  }

  const containsAllDay = doesContainAllDay(event, startDate);

  let startMinutesOfDay = eventStart.hours() * 60 + eventStart.minutes();
  if (
    startMinutesOfDay > 1410
    /* 23:30 */
  ) {
    startMinutesOfDay = 1410;
  }
  if (!eventStart.isSame(startDate, 'day') && !containsAllDay) {
    startMinutesOfDay = 0; // NOTE: 日またぎの予定のうち、後ろのものの表示開始時間を調整
  }

  let endMinutesOfDay = eventEnd.hours() * 60 + eventEnd.minutes();
  if (!containsAllDay) {
    if (endMinutesOfDay - startMinutesOfDay <= 30) {
      endMinutesOfDay = startMinutesOfDay + 30;
    } else if (endMinutesOfDay - startMinutesOfDay < 60) {
      endMinutesOfDay = startMinutesOfDay + 60;
    }

    if (!eventEnd.isSame(startDate, 'day')) {
      endMinutesOfDay = 1440; // NOTE: 日またぎの予定のうち、前のものの表示終了時間を調整
    }
  } else if (!eventStart.isSame(startDate, 'day')) {
    startMinutesOfDay = 0;
  }

  // FIXME: GENIE-1653 で API の仕様が変更になり、Event の各項目を __c のまま返さなくなったため
  // 空文字への変換は不要になっているはず。確認の上削除する。
  const aBaseEvent: BaseEvent = {
    id: event.id,
    title: event.title || '',
    start: eventStart,
    end: eventEnd,
    isAllDay: event.isAllDay,
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
    workCategoryName: event.workCategoryName || '',
    layout: {
      // NOTE: レイアウト用に持たせる項目
      containsAllDay,
      startMinutesOfDay,
      endMinutesOfDay,
    },
  };
  map[dateKey].push(aBaseEvent);

  if (!eventEnd.isSame(startDate, 'day')) {
    const anotherDate = startDate.add(1, 'days');
    return generateEvent(map, event, anotherDate);
  }

  return map;
};

const convertEventsFromRemote = (
  events: Event[]
): {
  [dateKey: string]: BaseEvent[];
} => {
  // Stringデータを変換
  const convertedEvents = events.reduce((map, event) => {
    const startDate = moment(moment(event.startDateTime).format('YYYY-MM-DD'));
    return generateEvent(map, event, startDate);
  }, {});

  return convertedEvents;
};

/**
 * デイリーサマリー用変換メソッド
 * fetchしたデータをreducerへ降ろす前の変換処理
 */
export const toViewModel = (
  fetchedEvents: Event[],
  day: moment.Moment
): BaseEvent[] => {
  const convertedEvents = convertEventsFromRemote(fetchedEvents);
  const key = day.format('YYYYMMDD');

  const isNotEndedAtDay = (event) => event.end.isAfter(day);
  const isStartedFromDay = (event) => event.start.isSame(day);
  const allEvents = flatten(
    convertedEvents[key] !== undefined ? [...convertedEvents[key]] : []
  );

  const events = flow(
    filter((event: BaseEvent) =>
      day.isBetween(
        event.start.clone().startOf('day'),
        event.end.clone().add(1, 'days').startOf('day'),
        null,
        '[]'
      )
    ),
    filter((event) => isNotEndedAtDay(event) || isStartedFromDay(event)),
    uniqBy((event: BaseEvent) =>
      isNil(event.id) ? event.externalEventId : event.id
    )
  )(allEvents);

  // レイアウト座標をデイリーサマリー向けに調整
  const returnEvents = modPosForDailySummary(events);

  if (returnEvents) {
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
    const getActualEndDate = (event) => {
      let endDate = event.end.clone();
      if (event.isAllDay) {
        endDate = endDate.add(1, 'days'); // NOTE: 終日の場合は終了日の00:00になっているため1日ずらす
      }
      return endDate;
    };
    return orderBy(
      returnEvents as BaseEvent[],
      [
        (event) => event.start,
        (event) => getActualEndDate(event),
        (event) => event.title,
      ],
      ['asc', 'desc', 'asc']
    );
  } else {
    return [];
  }
};

export default { toViewModel };
