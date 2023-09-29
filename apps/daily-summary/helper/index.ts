import { HOURS_HEIGHT } from '../constants/calendar';

import { BaseEvent } from '../../commons/models/DailySummary/BaseEvent';

// eslint-disable-next-line
export const isAllDayEvent = (event: BaseEvent) => {
  return event.isAllDay || event.layout.containsAllDay;
};

export const toClosestMinutes = (minutes: number): number =>
  minutes * (HOURS_HEIGHT / 60);

export const toDate = (dateStr: string): Date => {
  return new Date(dateStr.replace(/-/g, '/'));
};
