import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import Factory from '../NewRequest';

const LeaveRepository = {
  fetchList: jest.fn(),
};

const repositories = { LeaveRepository };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('create', () => {
  it.each`
    request                | expected
    ${{}}                  | ${'A'}
    ${{ leaveRange: 'A' }} | ${'A'}
    ${{ leaveRange: 'B' }} | ${'B'}
  `('should set leaveRange', async ({ request, expected }) => {
    (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(
      createMapByCode([
        { code: 'TEST', ranges: ['A', 'B', 'C'] },
        { code: 'TEST', ranges: ['A', 'B', 'C'] },
        { code: 'TEST', ranges: ['A', 'B', 'C'] },
      ])
    );
    const result = await Factory(repositories)({
      employeeId: 'employeeId',
      targetDate: 'targetDate',
    } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(request);
    expect(result.leaveRange).toEqual(expected);
  });

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
    async ({ request, targetDate, expected }) => {
      (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(
        createMapByCode([
          { code: 'TEST', ranges: [LEAVE_RANGE.Half, LEAVE_RANGE.Day] },
        ])
      );
      const result = await Factory(repositories)({
        targetDate,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.startDate).toEqual(expected[0]);
      expect(result.endDate).toEqual(expected[1]);
    }
  );

  it.each`
    request                                                  | expected
    ${{}}                                                    | ${null}
    ${{ leaveCode: '', leaveDetailCode: '' }}                | ${null}
    ${{ leaveCode: '', leaveDetailCode: 'ABC' }}             | ${null}
    ${{ leaveCode: '', leaveDetailCode: 'TEST_DETAIL' }}     | ${'TEST_DETAIL'}
    ${{ leaveCode: 'TEST', leaveDetailCode: 'TEST_DETAIL' }} | ${'TEST_DETAIL'}
  `('should set leaveDetailCode', async ({ request, expected }) => {
    (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(
      createMapByCode([
        {
          code: 'TEST',
          details: createMapByCode([{ code: 'TEST_DETAIL' }]),
        },
      ])
    );
    const result = await Factory(repositories)({
      employeeId: 'employeeId',
      targetDate: 'targetDate',
    } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(request);
    expect(result.leaveDetailCode).toEqual(expected);
  });

  it.each`
    request                   | expected
    ${{}}                     | ${'TEST1'}
    ${{ leaveCode: 'ABC' }}   | ${'TEST1'}
    ${{ leaveCode: 'TEST2' }} | ${'TEST2'}
  `('should set leaveCode', async ({ request, expected }) => {
    (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(
      createMapByCode([{ code: 'TEST1' }, { code: 'TEST2' }, { code: 'TEST3' }])
    );
    const result = await Factory(repositories)({
      employeeId: 'employeeId',
      targetDate: 'targetDate',
    } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(request);
    expect(result.leaveCode).toEqual(expected);
  });

  it.each`
    request                        | employeeId      | targetDate      | expected
    ${{}}                          | ${null}         | ${null}         | ${{ employeeId: null, targetDate: null }}
    ${{}}                          | ${null}         | ${'2023-01-01'} | ${{ employeeId: null, targetDate: '2023-01-01' }}
    ${{}}                          | ${'employeeId'} | ${null}         | ${{ employeeId: 'employeeId', targetDate: null }}
    ${{}}                          | ${'employeeId'} | ${'2023-01-01'} | ${{ employeeId: 'employeeId', targetDate: '2023-01-01' }}
    ${{ startDate: '2023-02-02' }} | ${null}         | ${null}         | ${{ employeeId: null, targetDate: null }}
    ${{ startDate: '2023-02-02' }} | ${null}         | ${'2023-01-01'} | ${{ employeeId: null, targetDate: '2023-01-01' }}
    ${{ startDate: '2023-02-02' }} | ${'employeeId'} | ${null}         | ${{ employeeId: 'employeeId', targetDate: null }}
    ${{ startDate: '2023-02-02' }} | ${'employeeId'} | ${'2023-01-01'} | ${{ employeeId: 'employeeId', targetDate: '2023-01-01' }}
  `(
    'should set leaves',
    async ({ request, employeeId, targetDate, expected }) => {
      (LeaveRepository.fetchList as jest.Mock).mockResolvedValue(
        createMapByCode([{ code: 'test' }])
      );
      const result = await Factory(repositories)({
        employeeId,
        targetDate,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.leaves).toEqual(createMapByCode([{ code: 'test' }]));
      expect(LeaveRepository.fetchList).toHaveBeenCalledWith(expected);
    }
  );
});
