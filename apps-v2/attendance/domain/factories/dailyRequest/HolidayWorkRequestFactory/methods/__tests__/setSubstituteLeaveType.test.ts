import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { SUBSTITUTE_LEAVE_TYPE as SLT } from '@attendance/domain/models/SubstituteLeaveType';

import method from '../setSubstituteLeaveType';

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  substituteLeaveType | substituteLeaveTypes         | expected
  ${null}             | ${null}                      | ${SLT.None}
  ${null}             | ${[]}                        | ${SLT.None}
  ${SLT.Substitute}   | ${null}                      | ${SLT.None}
  ${SLT.Substitute}   | ${[]}                        | ${SLT.None}
  ${SLT.Substitute}   | ${[SLT.CompensatoryStocked]} | ${SLT.None}
  ${SLT.Substitute}   | ${[SLT.Substitute]}          | ${SLT.Substitute}
`(
  'should set substituteLeaveType',
  ({ substituteLeaveType, substituteLeaveTypes, expected }) => {
    const result = method({
      substituteLeaveType,
      substituteLeaveTypes,
    } as unknown as HolidayWorkRequest);
    expect(result.substituteLeaveType).toEqual(expected);
  }
);
