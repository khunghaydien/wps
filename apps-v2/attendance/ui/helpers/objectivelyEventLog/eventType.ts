import msg from '@apps/commons/languages';

import {
  EVENT_TYPE,
  EventType,
} from '@attendance/domain/models/ObjectivelyEventLogRecord';

export type { EventType };
export { EVENT_TYPE };

export default (type: EventType): string => {
  switch (type) {
    case EVENT_TYPE.ENTERING:
      return msg().Att_Lbl_ObjectivelyEventLogEventTypeIn;
    case EVENT_TYPE.LEAVING:
      return msg().Att_Lbl_ObjectivelyEventLogEventTypeOut;
    default:
      return '';
  }
};
