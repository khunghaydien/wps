/**
 *
 * define custom event source
 *  Rule
 *   -  Value is `'EVENT_SOURCE'/DOMAIN/SOURCE_NAME`
 */
export const KEY_IN_CUSTOM_EVENT_DETAIL = 'source';

export const TIME_TRACK_REQUEST = 'EVENT_SOURCE/TIME_TRACKING/REQUEST';

export const TIME_TRACK_REQUEST_COMPACT =
  'EVENT_SOURCE/TIME_TRACKING/REQUEST_COMPACT';

export type TimeTrackCustomEventSource =
  | typeof TIME_TRACK_REQUEST
  | typeof TIME_TRACK_REQUEST_COMPACT;
