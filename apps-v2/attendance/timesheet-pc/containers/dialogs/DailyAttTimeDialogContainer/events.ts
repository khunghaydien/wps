import uuid from 'uuid';

import { create } from '@attendance/libraries/Event';

export default {
  saved: create<boolean>(`SAVED-${uuid()}`),
  submittedRequest: create<boolean>(`SUBMITTED_REQUEST-${uuid()}`),
  canceledApprovalRequest: create<void>(`CANCELED_APPROVAL_REQUEST-${uuid()}`),
  canceledSubmittedRequest: create<void>(
    `CANCELED_SUBMITTED_REQUEST-${uuid()}`
  ),
} as const;
