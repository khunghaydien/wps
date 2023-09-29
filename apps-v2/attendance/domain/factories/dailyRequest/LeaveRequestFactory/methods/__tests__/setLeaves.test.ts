import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import method from '../setLeaves';

const LeaveRepository = {
  fetchList: jest.fn(),
};

const repositories = { LeaveRepository };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('parameters', () => {
  it.each`
    targetDate      | employeeId      | ignoredId      | expected
    ${null}         | ${null}         | ${null}        | ${{ employeeId: null, targetDate: null, ignoredId: null }}
    ${null}         | ${null}         | ${'ignoredId'} | ${{ employeeId: null, targetDate: null, ignoredId: 'ignoredId' }}
    ${null}         | ${'employeeId'} | ${null}        | ${{ employeeId: 'employeeId', targetDate: null, ignoredId: null }}
    ${null}         | ${'employeeId'} | ${'ignoredId'} | ${{ employeeId: 'employeeId', targetDate: null, ignoredId: 'ignoredId' }}
    ${'2023-02-02'} | ${null}         | ${null}        | ${{ employeeId: null, targetDate: '2023-02-02', ignoredId: null }}
    ${'2023-02-02'} | ${null}         | ${'ignoredId'} | ${{ employeeId: null, targetDate: '2023-02-02', ignoredId: 'ignoredId' }}
    ${'2023-02-02'} | ${'employeeId'} | ${null}        | ${{ employeeId: 'employeeId', targetDate: '2023-02-02', ignoredId: null }}
    ${'2023-02-02'} | ${'employeeId'} | ${'ignoredId'} | ${{ employeeId: 'employeeId', targetDate: '2023-02-02', ignoredId: 'ignoredId' }}
  `(
    'should set leaves',
    async ({ targetDate, employeeId, ignoredId, expected }) => {
      (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(
        new Map([['code', 'value']])
      );
      const $method = await method(repositories)({
        targetDate,
        employeeId,
        ignoredId,
      });
      const result = $method({} as unknown as LeaveRequest);
      expect(result.leaves).toEqual(new Map([['code', 'value']]));
      expect(LeaveRepository.fetchList).toHaveBeenCalledWith(expected);
    }
  );
});

describe('leaves', () => {
  const newLeaves = createMapByCode([{ code: 'TEST' }]);
  describe('default', () => {
    it.each`
      leaveCode | expected
      ${null}   | ${newLeaves}
      ${'TEST'} | ${newLeaves}
    `('should set leaves', async ({ leaveCode, expected }) => {
      (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(newLeaves);
      const $method = await method(repositories)({
        targetDate: 'targetDate',
      });
      const result = $method({
        leaves: 'old leaves',
        leaveCode,
      } as unknown as LeaveRequest);
      expect(result.leaves).toEqual(expected);
    });
  });
  describe('for reapply', () => {
    it.each`
      leaveCode | expected
      ${null}   | ${'old leaves'}
      ${'TEST'} | ${newLeaves}
    `('should set leaves', async ({ leaveCode, expected }) => {
      (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(newLeaves);
      const $method = await method(repositories)({
        targetDate: 'targetDate',
      });
      const result = $method({
        requestTypeCode: CODE.Leave,
        status: STATUS.APPROVED,
        leaveRange: LEAVE_RANGE.Day,
        leaves: 'old leaves',
        leaveCode,
      } as unknown as LeaveRequest);
      expect(result.leaves).toEqual(expected);
    });
  });
});
