import {
  STATUS as DAILY_REQUEST_STATUS,
  Status as DailyRequestStatus,
} from '@attendance/domain/models/AttDailyRequest';
import {
  NotSubmittedReason,
  REASON,
  Result,
} from '@attendance/domain/models/Result';

export default ({
  dailyRequestSummary,
}: {
  dailyRequestSummary: {
    status: DailyRequestStatus;
  };
}): Result<NotSubmittedReason> => {
  switch (dailyRequestSummary.status) {
    case DAILY_REQUEST_STATUS.REJECTED:
    case DAILY_REQUEST_STATUS.CANCELED:
    case DAILY_REQUEST_STATUS.RECALLED:
      return {
        result: false,
        reason: REASON.EXISTED_INVALID_REQUEST,
      };

    case DAILY_REQUEST_STATUS.APPROVAL_IN:
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
