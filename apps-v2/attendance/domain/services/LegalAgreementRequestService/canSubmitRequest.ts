import {
  STATUS,
  Status,
} from '@attendance/domain/models/LegalAgreementRequest';
import {
  NotSubmittedReason,
  REASON,
  Result,
} from '@attendance/domain/models/Result';

export default ({ status }: { status: Status }): Result<NotSubmittedReason> => {
  switch (status) {
    case STATUS.REJECTED:
    case STATUS.CANCELED:
    case STATUS.REMOVED:
      return {
        result: false,
        reason: REASON.EXISTED_INVALID_REQUEST,
      };

    case STATUS.APPROVAL_IN:
    case STATUS.REAPPLYING:
      return {
        result: false,
        reason: REASON.EXISTED_SUBMITTING_REQUEST,
      };
    default:
  }
  return {
    result: true,
    value: undefined,
  };
};
