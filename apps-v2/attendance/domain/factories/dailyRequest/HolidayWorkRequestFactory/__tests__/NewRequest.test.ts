import {
  createDirectInput,
  DIRECT_INPUT,
} from '@attendance/domain/models/AttPattern';
import * as SubstituteLeaveType from '@attendance/domain/models/SubstituteLeaveType';

import Factory from '../NewRequest';
import createSubstituteLeaveTypesFactory from '../SubstituteLeaveTypesFactory';

jest.mock('../SubstituteLeaveTypesFactory', () => {
  const factory = {
    create: jest.fn(() => []),
  };
  return {
    __esModule: true,
    default: () => factory,
  };
});

const AttPatternRepository = {
  fetch: jest.fn(),
};

const repositories = { AttPatternRepository };

const { SUBSTITUTE_LEAVE_TYPE: SLT } = SubstituteLeaveType;

const patternName = {
  [DIRECT_INPUT]: 'Direct Input',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('create', () => {
  it.each`
    request                        | targetDate      | expected
    ${{}}                          | ${null}         | ${null}
    ${{}}                          | ${''}           | ${null}
    ${{}}                          | ${'2023-01-01'} | ${'2023-01-01'}
    ${{ startDate: '2023-02-02' }} | ${null}         | ${null}
    ${{ startDate: '2023-02-02' }} | ${''}           | ${null}
    ${{ startDate: '2023-02-02' }} | ${'2023-01-01'} | ${'2023-01-01'}
  `(
    'should set default targetDate',
    async ({ request, targetDate, expected }) => {
      const result = await Factory({ AttPatternRepository })({
        targetDate,
        workingType: {},
        patternName,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.startDate).toEqual(expected);
    }
  );

  it.each`
    request         | workingType                           | expected
    ${{}}           | ${{ startTime: null, endTime: null }} | ${{ startTime: null, endTime: null }}
    ${{}}           | ${{ startTime: 0, endTime: 0 }}       | ${{ startTime: 0, endTime: 0 }}
    ${{ id: 'id' }} | ${{ startTime: null, endTime: null }} | ${{ startTime: null, endTime: null }}
    ${{ id: 'id' }} | ${{ startTime: 0, endTime: 0 }}       | ${{ startTime: 0, endTime: 0 }}
  `(
    'should set default startTime and endTime',
    async ({ request, workingType, expected }) => {
      const result = await Factory(repositories)({
        workingType,
        patternName,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.startTime).toEqual(expected.startTime);
      expect(result.endTime).toEqual(expected.endTime);
    }
  );

  it.each`
    request                    | useHolidayWorkPatternApply | expected
    ${{}}                      | ${false}                   | ${DIRECT_INPUT}
    ${{ patternCode: 'ABC' }}  | ${false}                   | ${DIRECT_INPUT}
    ${{ patternCode: 'TEST' }} | ${false}                   | ${DIRECT_INPUT}
    ${{}}                      | ${true}                    | ${DIRECT_INPUT}
    ${{ patternCode: 'ABC' }}  | ${true}                    | ${DIRECT_INPUT}
    ${{ patternCode: 'TEST' }} | ${true}                    | ${'TEST'}
  `(
    'should set patternCode',
    async ({ request, employeeId, useHolidayWorkPatternApply, expected }) => {
      (AttPatternRepository.fetch as jest.Mock).mockResolvedValue({
        patterns: [{ code: 'TEST' }],
      });
      const result = await Factory(repositories)({
        employeeId,
        workingType: { useHolidayWorkPatternApply },
        patternName,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.patternCode).toEqual(expected);
    }
  );

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
    'should set patterns',
    async ({ request, employeeId, targetDate, expected }) => {
      (AttPatternRepository.fetch as jest.Mock).mockResolvedValue({
        patterns: [{ code: 'test' }],
      });
      const directInput = createDirectInput(patternName[DIRECT_INPUT], null);
      const result = await Factory(repositories)({
        employeeId,
        targetDate,
        workingType: { useHolidayWorkPatternApply: true },
        patternName,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.patterns).toEqual([directInput, { code: 'test' }]);
      expect(AttPatternRepository.fetch).toHaveBeenCalledWith(expected);
    }
  );

  it.each`
    request | workingType                              | expected
    ${{}}   | ${{}}                                    | ${false}
    ${{}}   | ${{ useHolidayWorkPatternApply: false }} | ${false}
    ${{}}   | ${{ useHolidayWorkPatternApply: true }}  | ${true}
  `(
    'should set default startTime and endTime',
    async ({ request, workingType, expected }) => {
      const result = await Factory(repositories)({
        workingType,
        patternName,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.enabledPatternApply).toEqual(expected);
    }
  );

  it.each`
    request                                             | expected
    ${{}}                                               | ${SLT.None}
    ${{ substituteLeaveType: SLT.CompensatoryStocked }} | ${SLT.None}
    ${{ substituteLeaveType: SLT.Substitute }}          | ${SLT.Substitute}
  `('should set default substituteLeaveType', async ({ request, expected }) => {
    const SubstituteLeaveTypesFactory = createSubstituteLeaveTypesFactory();
    (SubstituteLeaveTypesFactory.create as jest.Mock).mockReturnValue([
      SLT.Substitute,
    ]);
    const result = await Factory(repositories)({
      workingType: {},
      patternName,
    } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(request);
    expect(result.substituteLeaveType).toEqual(expected);
  });

  it.each`
    request | dayType      | workingType
    ${{}}   | ${null}      | ${'workingType'}
    ${{}}   | ${'dayType'} | ${'workingType'}
  `(
    'should set default substituteLeaveTypes',
    async ({ request, dayType, workingType }) => {
      const SubstituteLeaveTypesFactory = createSubstituteLeaveTypesFactory();
      (SubstituteLeaveTypesFactory.create as jest.Mock).mockReturnValue([
        'result',
      ]);
      const result = await Factory(repositories)({
        dayType,
        workingType,
        patternName,
      } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(
        request
      );
      expect(result.substituteLeaveTypes).toEqual(['result']);
      expect(SubstituteLeaveTypesFactory.create).toHaveBeenCalledWith({
        request,
        workingType,
        dayType,
      });
    }
  );
});
