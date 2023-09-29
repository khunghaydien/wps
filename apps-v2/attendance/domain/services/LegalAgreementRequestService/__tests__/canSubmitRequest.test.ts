import { STATUS } from '@attendance/domain/models/LegalAgreementRequest';
import { REASON } from '@attendance/domain/models/Result';

import canSubmitRequest from '../canSubmitRequest';

describe('canSubmitRequest', () => {
  it.each`
    status                  | result
    ${STATUS.NOT_REQUESTED} | ${{ result: true }}
    ${STATUS.APPROVAL_IN}   | ${{ result: false, reason: REASON.EXISTED_SUBMITTING_REQUEST }}
    ${STATUS.APPROVED}      | ${{ result: true }}
    ${STATUS.REJECTED}      | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
    ${STATUS.REMOVED}       | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
    ${STATUS.CANCELED}      | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
    ${STATUS.REAPPLYING}    | ${{ result: false, reason: REASON.EXISTED_SUBMITTING_REQUEST }}
  `(
    'should return $result when records as [status=$status]',
    ({ status, result }) => {
      expect(
        canSubmitRequest({
          status,
        })
      ).toEqual(result);
    }
  );
});
