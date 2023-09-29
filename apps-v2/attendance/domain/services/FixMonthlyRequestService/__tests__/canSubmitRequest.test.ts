import { STATUS as DAILY_REQUEST_STATUS } from '@attendance/domain/models/AttDailyRequest';
import { STATUS as LEGAL_AGREEMENT_REQUEST_STATUS } from '@attendance/domain/models/LegalAgreementRequest';
import { REASON } from '@attendance/domain/models/Result';

import canSubmitRequest from '../canSubmitRequest';

it.each`
  status                                                                      | result
  ${[DAILY_REQUEST_STATUS.NOT_REQUESTED, DAILY_REQUEST_STATUS.NOT_REQUESTED]} | ${{ result: true }}
  ${[DAILY_REQUEST_STATUS.NOT_REQUESTED, DAILY_REQUEST_STATUS.APPROVAL_IN]}   | ${{ result: false, reason: REASON.EXISTED_SUBMITTING_REQUEST }}
  ${[DAILY_REQUEST_STATUS.NOT_REQUESTED, DAILY_REQUEST_STATUS.CANCELED]}      | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
  ${[DAILY_REQUEST_STATUS.CANCELED, DAILY_REQUEST_STATUS.APPROVAL_IN]}        | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
  ${[DAILY_REQUEST_STATUS.APPROVAL_IN, DAILY_REQUEST_STATUS.CANCELED]}        | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
`(
  'should return $result when records as [status=$status]',
  ({ status, result }) => {
    expect(
      canSubmitRequest({
        records: [
          {
            dailyRequestSummary: {
              status: status[0],
            },
          },
          {
            dailyRequestSummary: {
              status: status[1],
            },
          },
        ],
      })
    ).toEqual(result);
  }
);

it.each`
  status                                                                                          | result
  ${[LEGAL_AGREEMENT_REQUEST_STATUS.NOT_REQUESTED, LEGAL_AGREEMENT_REQUEST_STATUS.NOT_REQUESTED]} | ${{ result: true }}
  ${[LEGAL_AGREEMENT_REQUEST_STATUS.NOT_REQUESTED, LEGAL_AGREEMENT_REQUEST_STATUS.APPROVAL_IN]}   | ${{ result: false, reason: REASON.EXISTED_SUBMITTING_REQUEST }}
  ${[LEGAL_AGREEMENT_REQUEST_STATUS.NOT_REQUESTED, LEGAL_AGREEMENT_REQUEST_STATUS.CANCELED]}      | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
  ${[LEGAL_AGREEMENT_REQUEST_STATUS.CANCELED, LEGAL_AGREEMENT_REQUEST_STATUS.APPROVAL_IN]}        | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
  ${[LEGAL_AGREEMENT_REQUEST_STATUS.APPROVAL_IN, LEGAL_AGREEMENT_REQUEST_STATUS.CANCELED]}        | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
`(
  'should return $result when legalAgreementRequests as [status=$status]',
  ({ status, result }) => {
    expect(
      canSubmitRequest({
        records: [],
        legalAgreementRequests: [
          {
            status: status[0],
          },
          {
            status: status[1],
          },
        ],
      })
    ).toEqual(result);
  }
);
