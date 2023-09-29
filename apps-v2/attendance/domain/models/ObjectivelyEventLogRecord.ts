export const EVENT_TYPE = {
  ENTERING: 'Entering',
  LEAVING: 'Leaving',
} as const;

export type EventType = Value<typeof EVENT_TYPE>;

export type ObjectivelyEventLogRecord = {
  id: string;
  eventType: EventType;
  time: number | null;
  linked: string;
};
