import msg from '@commons/languages';

import { COMMUTE_STATE } from '@attendance/domain/models/CommuteCount';

import options from '../options';

it('should create options', () => {
  expect(options()).toEqual([
    {
      value: COMMUTE_STATE.UNENTERED,
      label: msg().Att_Lbl_CommuteCountUnentered,
    },
    {
      value: COMMUTE_STATE.NONE,
      label: msg().Att_Lbl_CommuteCountNone,
    },
    {
      value: COMMUTE_STATE.BOTH_WAYS,
      label: msg().Att_Lbl_CommuteCountBothWays,
    },
    {
      value: COMMUTE_STATE.FORWARD,
      label: msg().Att_Lbl_CommuteCountForward,
    },
    {
      value: COMMUTE_STATE.BACKWARD,
      label: msg().Att_Lbl_CommuteCountBackward,
    },
  ]);
});
