import msg from '@commons/languages';

import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

import substituteLeaveTypeName from '../substituteLeaveTypeName';

it.each`
  type                                         | expected
  ${SUBSTITUTE_LEAVE_TYPE.None}                | ${msg().Att_Lbl_DoNotUseReplacementDayOff}
  ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${msg().$Att_Lbl_SubstituteLeave}
  ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${msg().Att_Lbl_CompensatoryLeave}
  ${'ABC'}                                     | ${''}
`('should do with $type', ({ type, expected }) => {
  expect(substituteLeaveTypeName(type)).toEqual(expected);
});
