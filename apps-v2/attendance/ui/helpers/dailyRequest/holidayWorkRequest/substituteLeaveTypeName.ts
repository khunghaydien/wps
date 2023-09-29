import msg from '@commons/languages';

import {
  SUBSTITUTE_LEAVE_TYPE,
  SubstituteLeaveType,
} from '@attendance/domain/models/SubstituteLeaveType';

export default (type: SubstituteLeaveType): string => {
  switch (type) {
    case SUBSTITUTE_LEAVE_TYPE.None:
      return msg().Att_Lbl_DoNotUseReplacementDayOff;
    case SUBSTITUTE_LEAVE_TYPE.Substitute:
      return msg().$Att_Lbl_SubstituteLeave;
    case SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked:
      return msg().Att_Lbl_CompensatoryLeave;
    default:
      return '';
  }
};
