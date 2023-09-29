import { Status as DailyRequestStatus } from '@attendance/domain/models/AttDailyRequest';
import { Status as LegalAgreementStatus } from '@attendance/domain/models/LegalAgreementRequest';
import {
  NotSubmittedReason,
  REASON,
  Result,
} from '@attendance/domain/models/Result';

import canSubmitRequestByFixDailyRequest from '@attendance/domain/services/FixDailyRequestService/canSubmitRequest';
import canSubmitRequestByLegalAgreementRequest from '@attendance/domain/services/LegalAgreementRequestService/canSubmitRequest';

export default ({
  records,
  legalAgreementRequests,
}: {
  records: {
    dailyRequestSummary: {
      status: DailyRequestStatus;
    };
  }[];
  legalAgreementRequests?: {
    status: LegalAgreementStatus;
  }[];
}): Result<NotSubmittedReason> => {
  let result: Result<NotSubmittedReason> = {
    result: true,
    value: undefined,
  };
  for (const record of records) {
    if (!record.dailyRequestSummary?.status) {
      continue;
    }
    const resultRecord = canSubmitRequestByFixDailyRequest(record);
    if (resultRecord.result === false) {
      if (resultRecord.reason === REASON.EXISTED_SUBMITTING_REQUEST) {
        result = resultRecord;
      } else if (resultRecord.reason === REASON.EXISTED_INVALID_REQUEST) {
        result = resultRecord;
        break;
      }
    }
  }
  if (result.result === false) {
    return result;
  }

  if (!legalAgreementRequests) {
    return result;
  }

  for (const record of legalAgreementRequests) {
    if (!record?.status) {
      continue;
    }
    const resultRecord = canSubmitRequestByLegalAgreementRequest(record);
    if (resultRecord.result === false) {
      if (resultRecord.reason === REASON.EXISTED_SUBMITTING_REQUEST) {
        result = resultRecord;
      } else if (resultRecord.reason === REASON.EXISTED_INVALID_REQUEST) {
        result = resultRecord;
        break;
      }
    }
  }
  return result;
};
