import msg from '@commons/languages';

import {
  COMMUTE_STATE,
  CommuteState,
} from '@attendance/domain/models/CommuteCount';

export default (commuteState: CommuteState): string => {
  switch (commuteState) {
    case COMMUTE_STATE.UNENTERED:
      return msg().Att_Lbl_CommuteCountUnentered;
    case COMMUTE_STATE.NONE:
      return msg().Att_Lbl_CommuteCountNone;
    case COMMUTE_STATE.BOTH_WAYS:
      return msg().Att_Lbl_CommuteCountBothWays;
    case COMMUTE_STATE.FORWARD:
      return msg().Att_Lbl_CommuteCountForward;
    case COMMUTE_STATE.BACKWARD:
      return msg().Att_Lbl_CommuteCountBackward;
    default:
      return '';
  }
};
