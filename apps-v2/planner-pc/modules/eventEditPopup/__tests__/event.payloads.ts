import moment from 'moment';

import { CalendarEvent } from '../../../models/calendar-event/CalendarEvent';

export const event = {
  id: 'a172v00000dWP7gAAG',
  title: 'hhhhh',
  start: moment('2019-09-17T15:00:00.000Z'),
  end: moment('2019-09-24T15:00:00.000Z'),
  isAllDay: true,
  isOrganizer: true,
  isOuting: false,
  location: '',
  remarks: '',
  createdServiceBy: 'teamspirit',
  externalEventId: null,
  job: {
    id: '',
    name: '',
    code: '',
  },
  workCategoryId: '',
  workCategoryCode: '',
  workCategoryName: '',
  layout: {
    colSpan: 4,
    colIndex: 3,
    startMinutesOfDay: 0,
    endMinutesOfDay: 0,
    visibleInMonthlyView: true,
    containsAllDay: true,
  },
} as CalendarEvent;

export const job = {
  id: 'a0h2v00000XB8o2AAD',
  code: '001',
  name: 'TEST',
};
