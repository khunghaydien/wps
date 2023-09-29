import * as DomainLeaveRange from '@attendance/domain/models/LeaveRange';
import * as DomainLeaveType from '@attendance/domain/models/LeaveType';

import { Response } from '../../fetchList';

export const defaultValue: Response = {
  leaves: [
    {
      name: 'Test',
      code: 'TEST',
      type: DomainLeaveType.LEAVE_TYPE.Annual,
      ranges: [
        DomainLeaveRange.LEAVE_RANGE.PM,
        DomainLeaveRange.LEAVE_RANGE.AM,
      ],
      details: [
        {
          name: 'Test Detail',
          code: 'TEST_DETAIL',
          ranges: [
            DomainLeaveRange.LEAVE_RANGE.PM,
            DomainLeaveRange.LEAVE_RANGE.AM,
          ],
        },
      ],
      daysLeft: 14,
      hoursLeft: 6,
      timeLeaveDaysLeft: 3,
      timeLeaveHoursLeft: 2,
      requireReason: true,
    },
  ],
};
