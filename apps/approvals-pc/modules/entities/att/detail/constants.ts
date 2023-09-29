export const FETCH_SUCCESS = 'MODULES/ENTITIES/ATT/DETAIL/FETCH_SUCCESS';

export const requestType = {
  LEAVE: 'Leave',
  HOLIDAY_WORK: 'HolidayWork',
  EARLY_START_WORK: 'EarlyStartWork',
  OVERTIME_WORK: 'OvertimeWork',
  ABSENCE: 'Absence',
  DIRECT: 'Direct',
  PATTERN: 'Pattern',
};

export const leaveRangeType = {
  DAY: 'Day',
  AM: 'AM',
  PM: 'PM',
  HALF: 'Half',
  TIME: 'Time',
};

export const absenceRangeType = {
  DAY: 'Day',
};

export const substituteLeaveType = {
  Substitute: 'Substitute',
};

export const leaveRangeLabel = {
  [leaveRangeType.DAY]: 'Att_Lbl_DayLeave',
  [leaveRangeType.AM]: 'Att_Lbl_AMLeave',
  [leaveRangeType.PM]: 'Att_Lbl_PMLeave',
  [leaveRangeType.HALF]: 'Att_Lbl_HalfDayLeave',
  [leaveRangeType.TIME]: 'Att_Lbl_TimeLeave',
};

export const substituteLeaveTypeLabel = {
  [substituteLeaveType.Substitute]: 'Att_Lbl_Substitute',
  '': null,
};
