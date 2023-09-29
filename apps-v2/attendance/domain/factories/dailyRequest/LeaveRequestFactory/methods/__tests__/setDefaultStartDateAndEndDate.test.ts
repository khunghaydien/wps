import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import method from '../setDefaultStartDateAndEndDate';

it.each`
  request                                                      | targetDate      | expected
  ${{}}                                                        | ${null}         | ${[null, null]}
  ${{}}                                                        | ${''}           | ${[null, null]}
  ${{}}                                                        | ${'2023-01-01'} | ${['2023-01-01', null]}
  ${{ leaveRange: LEAVE_RANGE.Half }}                          | ${null}         | ${[null, null]}
  ${{ leaveRange: LEAVE_RANGE.Half }}                          | ${''}           | ${[null, null]}
  ${{ leaveRange: LEAVE_RANGE.Half }}                          | ${'2023-01-01'} | ${['2023-01-01', null]}
  ${{ leaveRange: LEAVE_RANGE.Day }}                           | ${null}         | ${[null, null]}
  ${{ leaveRange: LEAVE_RANGE.Day }}                           | ${''}           | ${[null, null]}
  ${{ leaveRange: LEAVE_RANGE.Day }}                           | ${'2023-01-01'} | ${['2023-01-01', '2023-01-01']}
  ${{ startDate: '2023-02-02' }}                               | ${null}         | ${[null, null]}
  ${{ startDate: '2023-02-02' }}                               | ${''}           | ${[null, null]}
  ${{ startDate: '2023-02-02' }}                               | ${'2023-01-01'} | ${['2023-01-01', null]}
  ${{ startDate: '2023-02-02', leaveRange: LEAVE_RANGE.Half }} | ${null}         | ${[null, null]}
  ${{ startDate: '2023-02-02', leaveRange: LEAVE_RANGE.Half }} | ${''}           | ${[null, null]}
  ${{ startDate: '2023-02-02', leaveRange: LEAVE_RANGE.Half }} | ${'2023-01-01'} | ${['2023-01-01', null]}
  ${{ startDate: '2023-02-02', leaveRange: LEAVE_RANGE.Day }}  | ${null}         | ${[null, null]}
  ${{ startDate: '2023-02-02', leaveRange: LEAVE_RANGE.Day }}  | ${''}           | ${[null, null]}
  ${{ startDate: '2023-02-02', leaveRange: LEAVE_RANGE.Day }}  | ${'2023-01-01'} | ${['2023-01-01', '2023-01-01']}
`(
  'should set default startDate and endDate',
  ({ request, targetDate, expected }) => {
    const result = method(targetDate)(request);
    expect(result.startDate).toEqual(expected[0]);
    expect(result.endDate).toEqual(expected[1]);
  }
);
