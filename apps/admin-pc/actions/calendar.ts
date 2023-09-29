import { Calendar } from '../models/calendar/Calendar';

import * as base from './base';

export const FUNC_NAME = 'calendar';
export const SEARCH_CALENDAR_ERROR = 'SEARCH_CALENDAR_ERROR';

export type SearchAttendanceCalendarAction = {
  type: 'SEARCH_ATTENDANCE_CALENDAR';
  payload: Calendar[];
};

export type Action = SearchAttendanceCalendarAction;

export const SEARCH_ATTENDANCE_CALENDAR: SearchAttendanceCalendarAction['type'] =
  'SEARCH_ATTENDANCE_CALENDAR';

export const searchCalendar = (param: any = {}) =>
  base.search(
    FUNC_NAME,
    param,
    SEARCH_ATTENDANCE_CALENDAR,
    SEARCH_CALENDAR_ERROR
  );
