import { Locale } from 'date-fns';

type DayEnum = {
  Sunday: 0;
  Monday: 1;
  Tuesday: 2;
  Wednesday: 3;
  Thursday: 4;
  Friday: 5;
  Saturday: 6;
};

export const DAY: DayEnum = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const WEEK_START_ON: {
  weekStartOn?: DayEnum[keyof DayEnum];
  locale?: Locale;
} = {
  weekStartOn: DAY.Sunday,
};

export const DEFAULT_MINUTES = 30;

export const MAX_ALL_DAY_EVENT = 3;

export const HOURS_HEIGHT_ON_WEEKLY_CALENDAR = 50;

export const WEEKLY_CALENDAR_HEADER_HEIGHT = 38;

export const ALL_DAY_EVENT_HEIGHT = 28;
