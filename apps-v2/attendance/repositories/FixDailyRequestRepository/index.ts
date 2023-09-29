import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';

import cancelApproval from './cancelApproval';
import cancelSubmitted from './cancelSubmitted';
import canSubmit from './canSubmit';
import submit from './submit';

const repository: IFixDailyRequestRepository = {
  submit,
  canSubmit,
  cancelApproval,
  cancelSubmitted,
};

export default repository;
