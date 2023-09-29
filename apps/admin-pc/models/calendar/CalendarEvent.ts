export const DAY_TYPE = {
  Workday: 'Workday',
  Holiday: 'Holiday',
  LegalHoliday: 'LegalHoliday',
} as const;

export type DayType = keyof typeof DAY_TYPE;

export type CalendarEvent = {
  id?: string;
  name: string;
  // eslint-disable-next-line camelcase
  name_L0: string;
  // eslint-disable-next-line camelcase
  name_L1: string;
  // eslint-disable-next-line camelcase
  name_L2: string;
  recordDate: string;
  calendarId: string;
  dayType: DayType;
  remarks: string;
};

export const create = (calendarId: string): CalendarEvent => ({
  calendarId,
  name: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L0: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L1: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L2: '',
  recordDate: '',
  dayType: DAY_TYPE.Holiday,
  remarks: '',
});
