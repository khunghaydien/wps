import {
  convert,
  FixDailyRequestViewModel,
} from '@apps/approvals-pc/models/attendance/FixDailyRequestViewModel';
import { defaultValue as $defaultValue } from '@attendance/domain/models/approval/__tests__/mocks/FixDailyRequest.mock';

export const defaultValue: FixDailyRequestViewModel = convert($defaultValue);
