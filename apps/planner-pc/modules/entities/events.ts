import {
  addMinutes,
  differenceInCalendarDays,
  eachDay,
  endOfDay,
  endOfWeek,
  isAfter,
  isEqual,
  isSameDay,
  isSameWeek,
  max,
  min,
  startOfDay,
  startOfWeek,
  subMinutes,
} from 'date-fns';
import _ from 'lodash';
import filter from 'lodash/fp/filter';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import mapValues from 'lodash/fp/mapValues';

import { DEFAULT_MINUTES, WEEK_START_ON } from '../../constants/calendar';

import DateUtil from '../../../commons/utils/DateUtil';

import { Event } from '../../../domain/models/time-management/Event';

// State

export type EventViewModel = {
  /**
   * The day length of the event.
   *
   * the event less than 24-hour is also counted as 1.
   */
  period: number;
  /**
   * The hours of the event
   */
  hours: number;
  /**
   * The minutes of the event
   * If the minute is less than 29 minutes, return 30
   */
  minutes: number;
  /**
   * Event start date time
   */
  startDateTime: Date;
  /**
   * Event end date time
   */
  endDateTime: Date;
  /**
   * Event end date time
   * Use to internal calculate
   */
  internalEndDateTime: Date;
  /**
   * Date of event
   */
  date: Date;
  /**
   * The day length of the week including `date`
   *
   * the event less than 24-hour is also counted as 1.
   */
  periodOfWeek: number;
  /**
   * The start date of the week including `date`
   */
  startDateTimeOfWeek: Date;
  startDateTimeOfDay: Date;
  /**
   * The end date of the week including `date`
   */
  endDateTimeOfWeek: Date;
  endDateTimeOfDay: Date;
  /**
   * Elapsed minutes since the day started
   */

  elapsedMinutesOfStartDateTime: number;
  elapsedMinutesOfEndDateTime: number;
  /**
   * The flag determines which the event is over multiple days or not.
   */
  isOverMultipleDays: boolean;
  /**
   * The flag determines which the event is less than a day or not.
   */
  isLessThanDay: boolean;
  /**
   * The flag determines which the event is over multiple weeks or not.
   */
  isOverMultipleWeeks: boolean;
  /**
   * The flag determines which the event can be edited.
   */
  isReadOnly: boolean;
  /**
   * The flag determines whether an event is being edited.
   */
  isEditing: boolean;
  /**
   * The flag determines whether an event is being created.
   */
  isCreating: boolean;
} & Omit<Event, 'startDateTime' | 'endDateTime'>;

export type State = {
  [K in string]: ReadonlyArray<EventViewModel>;
};

const initialState = {};

// Actions

type FetchSuccess = {
  type: '/PLANNER-PC/MODULES/ENTITIES/EVENTS/FETCH_SUCCESS';
  payload: {
    events: ReadonlyArray<Event>;
    startDate: Date;
    endDate: Date;
  };
};

type Update = {
  type: '/PLANNER-PC/MODULES/ENTITIES/EVENTS/UPDATE';
  payload: {
    id: string;
    key: 'isEditing' | 'isCreating';
    value: boolean;
  };
};

type Action = FetchSuccess | Update;

export const FETCH_SUCCESS =
  '/PLANNER-PC/MODULES/ENTITIES/EVENTS/FETCH_SUCCESS';

export const UPDATE = '/PLANNER-PC/MODULES/ENTITIES/EVENTS/UPDATE';

export const actions = {
  fetchSuccess: (
    events: ReadonlyArray<Event>,
    startDate: Date,
    endDate: Date
  ): FetchSuccess => ({
    type: FETCH_SUCCESS,

    payload: {
      events,
      startDate,
      endDate,
    },
  }),
  update: (
    id: string,
    key: 'isEditing' | 'isCreating',
    value: boolean
  ): Update => ({
    type: UPDATE,

    payload: {
      id,
      key,
      value,
    },
  }),
};

// Reducer

const toInternalDateTime = (
  startDate: Date,
  endDate: Date,
  isLessThanDay: boolean
): Date => {
  if (!isLessThanDay) {
    return subMinutes(endDate, 1);
  } else if (
    !isSameDay(startDate, endDate) &&
    isEqual(endDate, startOfDay(endDate))
  ) {
    return subMinutes(endDate, 1);
  }
  return endDate;
};

// NOTE: 予定の時間が30分未満の場合でも、予定UI上は30分の高さにする
const toCorrectMinutes = (endDate: Date, startDate: Date): number => {
  const minutes = DateUtil.differenceInMinutes(endDate, startDate);

  if (minutes >= DEFAULT_MINUTES) {
    return minutes;
  }
  return DEFAULT_MINUTES;
};

export const toKey = (date?: Date): string => (date ? date.toISOString() : '');

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      const minDate = action.payload.startDate;
      const maxDate = action.payload.endDate;
      const events = flow(
        map((event: Event) => {
          const startDateTime = new Date(event.startDateTime);
          const endDateTime = new Date(event.endDateTime);
          const hours = DateUtil.differenceInHours(endDateTime, startDateTime);

          const isLessThanDay = !event.isAllDay && hours < 24;

          const internalEndDateTime = toInternalDateTime(
            startDateTime,
            endDateTime,
            hours < 24
          );

          return {
            ...event,
            startDateTime,
            endDateTime,
            internalEndDateTime,
            isLessThanDay,
            hours,
            period:
              differenceInCalendarDays(internalEndDateTime, startDateTime) + 1,
            isOverMultipleDays: !isSameDay(startDateTime, endDateTime),
            isOverMultipleWeeks: !isSameWeek(
              startDateTime,
              internalEndDateTime,
              WEEK_START_ON
            ),
            isReadOnly:
              event.createdServiceBy !== 'teamspirit' &&
              event.createdServiceBy !== 'teamspiritPSA',
            isEditing: false,
            isCreating: false,
          };
        }),
        filter(
          (event) =>
            new Date(action.payload.startDate) <= event.internalEndDateTime
        )
      )(action.payload.events);

      return flow(
        flatMap((event: EventViewModel) => {
          // FIXME Return string as key value
          const key = (date: Date): Date => startOfWeek(date, WEEK_START_ON);

          const dates = eachDay(
            max(minDate, event.startDateTime),
            min(maxDate, event.internalEndDateTime)
          );
          const weeks: Record<
            string,
            {
              startDateTimeOfWeek: Date;
              endDateTimeOfWeek: Date;
              periodOfWeek: number;
            }
          > = flow(
            groupBy((date: Date) => key(date)),
            mapValues((days: readonly Date[]) => {
              const startDateTimeOfWeek = max(
                _.first(days),
                startOfWeek(event.startDateTime)
              );
              const endDateTimeOfWeek = min(
                _.last(days),
                endOfWeek(event.internalEndDateTime)
              );
              const periodOfWeek =
                differenceInCalendarDays(
                  endDateTimeOfWeek,
                  startDateTimeOfWeek
                ) + 1;
              return {
                startDateTimeOfWeek,
                endDateTimeOfWeek,
                periodOfWeek,
              };
            })
          )(dates);

          return dates.map((date: Date) => {
            const startDateTimeOfDay = isSameDay(event.startDateTime, date)
              ? event.startDateTime
              : startOfDay(date);
            const endDateTimeOfDay = isSameDay(event.endDateTime, date)
              ? event.endDateTime
              : endOfDay(date);
            const minutes = toCorrectMinutes(
              endDateTimeOfDay,
              startDateTimeOfDay
            );

            const at2330 = subMinutes(endOfDay(startDateTimeOfDay), 30);
            const internalStartDateTimeOfDay =
              // NOTE: 23:30 以降の予定は全て 23:30 開始の予定として表示するため
              isAfter(startDateTimeOfDay, at2330) ? at2330 : startDateTimeOfDay;

            const elapsedMinutesOfStartDateTime = DateUtil.differenceInMinutes(
              startOfDay(startDateTimeOfDay),
              internalStartDateTimeOfDay
            );

            const internalEndDateTimeOfDay =
              // NOTE: 30分未満の予定は30分の予定として表示するため
              minutes <= 30
                ? addMinutes(internalStartDateTimeOfDay, 30)
                : endDateTimeOfDay;

            const elapsedMinutesOfEndDateTime = DateUtil.differenceInMinutes(
              startOfDay(startDateTimeOfDay),
              internalEndDateTimeOfDay
            );

            return {
              ...event,
              ...weeks[key(date) as any],
              startDateTimeOfDay,
              endDateTimeOfDay,
              date,
              minutes,
              elapsedMinutesOfStartDateTime,
              elapsedMinutesOfEndDateTime,
            };
          });
        }),
        groupBy((event) => toKey(event.date)),
        mapValues((es: State[keyof State]) =>
          _.orderBy(es, [(e) => e.period], ['desc'])
        )
      )(events as Array<EventViewModel>);
    }
    case UPDATE: {
      return mapValues((es: State[keyof State]) => {
        return es.map((event: EventViewModel) => {
          if (event.id === action.payload.id) {
            return {
              ...event,
              [action.payload.key]: action.payload.value,
            };
          }
          return event;
        });
      }, state);
    }

    default:
      return state;
  }
};
