export type CalendarServiceId =
  | 'teamspirit'
  | 'google'
  | 'office365'
  | 'salesforce'
  | 'teamspiritPSA';

export type Event = {
  id: string;
  ownerId: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
  isOrganizer: boolean;
  calculateCapacity: boolean;
  location: null | string;
  description: null | string;
  isOuting: boolean;
  createdServiceBy: CalendarServiceId;
  externalEventId: null | string;
  jobId: string | null | undefined;
  jobCode: string | null | undefined;
  jobName: string | null | undefined;
  workCategoryId: string | null | undefined;
  workCategoryCode: string | null | undefined;
  workCategoryName: string | null | undefined;
  contactId: null | string;
  contactName: null | string;
};
