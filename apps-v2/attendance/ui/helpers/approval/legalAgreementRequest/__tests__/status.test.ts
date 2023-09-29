import msg from '@commons/languages';

import { STATUS } from '@attendance/domain/models/approval/LegalAgreementRequest';

import status from '../status';

it('should be set to all properties', () => {
  Object.values(STATUS).forEach((value) => {
    expect(status(value)).not.toBe('');
  });
});

it.each`
  value                | expected
  ${STATUS.APPROVED}   | ${msg().Att_Lbl_ReqStatApproved}
  ${STATUS.CANCELED}   | ${msg().Att_Lbl_ReqStatCanceled}
  ${STATUS.PENDING}    | ${msg().Att_Lbl_ReqStatPending}
  ${STATUS.REAPPLIED}  | ${msg().Att_Lbl_ReqStatApproved}
  ${STATUS.REAPPLYING} | ${msg().Att_Lbl_ReqStatPending}
  ${STATUS.REJECTED}   | ${msg().Att_Lbl_ReqStatRejected}
  ${STATUS.REMOVED}    | ${msg().Att_Lbl_ReqStatRecalled}
`('should be $expected when $value', ({ value, expected }) => {
  expect(status(value)).toBe(expected);
});
