import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import method from '../setPatterns';

const AttPatternRepository = {
  fetch: jest.fn(),
};

const repositories = { AttPatternRepository };
beforeEach(() => {
  jest.clearAllMocks();
});

describe('With useHolidayWorkPatternApply = true', () => {
  it.each`
    targetDate      | employeeId      | expected
    ${null}         | ${null}         | ${{ employeeId: null, targetDate: null }}
    ${null}         | ${'employeeId'} | ${{ employeeId: 'employeeId', targetDate: null }}
    ${'2023-02-02'} | ${null}         | ${{ employeeId: null, targetDate: '2023-02-02' }}
    ${'2023-02-02'} | ${'employeeId'} | ${{ employeeId: 'employeeId', targetDate: '2023-02-02' }}
  `('should set attPatterns', async ({ targetDate, employeeId, expected }) => {
    (AttPatternRepository.fetch as jest.Mock).mockResolvedValue({
      patterns: ['attPatterns'],
    });
    const $method = await method(repositories)({
      useHolidayWorkPatternApply: true,
    } as unknown as WorkingType)({
      targetDate,
      employeeId,
    });
    const result = $method({} as unknown as HolidayWorkRequest);
    expect(result.patterns).toEqual(['attPatterns']);
    expect(AttPatternRepository.fetch).toHaveBeenCalledWith(expected);
  });
});

describe('With useHolidayWorkPatternApply = false', () => {
  it.each`
    targetDate      | employeeId
    ${null}         | ${null}
    ${null}         | ${'employeeId'}
    ${'2023-02-02'} | ${null}
    ${'2023-02-02'} | ${'employeeId'}
  `('should set attPatterns', async ({ targetDate, employeeId }) => {
    (AttPatternRepository.fetch as jest.Mock).mockResolvedValue({
      patterns: ['attPatterns'],
    });
    const $method = await method(repositories)({
      useHolidayWorkPatternApply: false,
    } as unknown as WorkingType)({
      targetDate,
      employeeId,
    });
    const result = $method({} as unknown as HolidayWorkRequest);
    expect(result.patterns).toEqual([]);
    expect(AttPatternRepository.fetch).toHaveBeenCalledTimes(0);
  });
});
