import msg from '@commons/languages';

import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import rangeName from '../rangeName';

it.each`
  range               | expected
  ${LEAVE_RANGE.Day}  | ${msg().Att_Lbl_FullDayLeave}
  ${LEAVE_RANGE.AM}   | ${msg().Att_Lbl_FirstHalfOfDayLeave}
  ${LEAVE_RANGE.PM}   | ${msg().Att_Lbl_SecondHalfOfDayLeave}
  ${LEAVE_RANGE.Half} | ${msg().Att_Lbl_HalfDayLeave}
  ${LEAVE_RANGE.Time} | ${msg().Att_Lbl_HourlyLeave}
  ${'ABC'}            | ${''}
`('should do with $range', ({ range, expected }) => {
  expect(rangeName(range)).toEqual(expected);
});
