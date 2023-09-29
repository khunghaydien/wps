import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import createMapByCode from '@apps/attendance/libraries/utils/Array/createMapByCode';

import selectedLeave from '../selectedLeave';

it('should be get leave', () => {
  expect(
    selectedLeave({
      leaveCode: 'TEST1',
      leaves: createMapByCode([
        {
          code: 'TEST1',
        },
        { code: 'TEST2' },
      ]),
    } as unknown as LeaveRequest)
  ).toEqual({ code: 'TEST1' });
});
