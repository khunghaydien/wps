import msg from '@commons/languages';

import { LEAVE_RANGE, LeaveRange } from '@attendance/domain/models/LeaveRange';

export default (range: LeaveRange): string => {
  switch (range) {
    case LEAVE_RANGE.Day:
      return msg().Att_Lbl_FullDayLeave;
    case LEAVE_RANGE.AM:
      return msg().Att_Lbl_FirstHalfOfDayLeave;
    case LEAVE_RANGE.PM:
      return msg().Att_Lbl_SecondHalfOfDayLeave;
    case LEAVE_RANGE.Half:
      return msg().Att_Lbl_HalfDayLeave;
    case LEAVE_RANGE.Time:
      return msg().Att_Lbl_HourlyLeave;
    default:
      return '';
  }
};
