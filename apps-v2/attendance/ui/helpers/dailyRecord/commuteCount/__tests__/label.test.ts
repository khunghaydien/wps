import msg from '@commons/languages';

import { COMMUTE_STATE } from '@attendance/domain/models/CommuteCount';

import label from '../label';

it.each`
  commuteState               | expected
  ${COMMUTE_STATE.UNENTERED} | ${msg().Att_Lbl_CommuteCountUnentered}
  ${COMMUTE_STATE.NONE}      | ${msg().Att_Lbl_CommuteCountNone}
  ${COMMUTE_STATE.FORWARD}   | ${msg().Att_Lbl_CommuteCountForward}
  ${COMMUTE_STATE.BACKWARD}  | ${msg().Att_Lbl_CommuteCountBackward}
  ${COMMUTE_STATE.BOTH_WAYS} | ${msg().Att_Lbl_CommuteCountBothWays}
`(
  'should be $expected if commute state is $commuteState',
  ({ commuteState, expected }) => {
    expect(label(commuteState)).toEqual(expected);
  }
);
