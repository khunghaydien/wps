export const TIMESHEET_VIEW_TYPE = {
  GRAPH: 'graph',
  TABLE: 'table',
} as const;

export type TimesheetViewType = Value<typeof TIMESHEET_VIEW_TYPE>;
