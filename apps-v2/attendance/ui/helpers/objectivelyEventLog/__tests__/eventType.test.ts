import msg from '@apps/commons/languages';

import eventType, { EVENT_TYPE } from '../eventType';

it('should do.', () => {
  expect(eventType(EVENT_TYPE.ENTERING)).toBe(
    msg().Att_Lbl_ObjectivelyEventLogEventTypeIn
  );
  expect(eventType(EVENT_TYPE.LEAVING)).toBe(
    msg().Att_Lbl_ObjectivelyEventLogEventTypeOut
  );
  // @ts-ignore
  expect(eventType('test')).toBe('');
});
