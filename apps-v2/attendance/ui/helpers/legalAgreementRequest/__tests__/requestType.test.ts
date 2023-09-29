import msg from '@commons/languages';

import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import requestType from '../requestType';

it.each`
  value           | expected
  ${CODE.MONTHLY} | ${msg().Appr_Lbl_Monthly}
  ${CODE.YEARLY}  | ${msg().Appr_Lbl_Yearly}
  ${'XXX'}        | ${''}
`('should be $expected when $value', ({ value, expected }) => {
  expect(requestType(value)).toBe(expected);
});
