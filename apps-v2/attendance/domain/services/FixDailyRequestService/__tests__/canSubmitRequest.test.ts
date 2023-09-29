import { STATUS as DAILY_REQUEST_STATUS } from '@attendance/domain/models/AttDailyRequest';
import { REASON } from '@attendance/domain/models/Result';

import canSubmitRequest from '../canSubmitRequest';

it.each`
  status                                | result
  ${DAILY_REQUEST_STATUS.REJECTED}      | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
  ${DAILY_REQUEST_STATUS.CANCELED}      | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
  ${DAILY_REQUEST_STATUS.RECALLED}      | ${{ result: false, reason: REASON.EXISTED_INVALID_REQUEST }}
  ${DAILY_REQUEST_STATUS.APPROVAL_IN}   | ${{ result: false, reason: REASON.EXISTED_SUBMITTING_REQUEST }}
  ${DAILY_REQUEST_STATUS.NOT_REQUESTED} | ${{ result: true }}
`('should return $result when [status=$status]', ({ status, result }) => {
  expect(
    canSubmitRequest({
      dailyRequestSummary: {
        status,
      },
    })
  ).toEqual(result);
});
