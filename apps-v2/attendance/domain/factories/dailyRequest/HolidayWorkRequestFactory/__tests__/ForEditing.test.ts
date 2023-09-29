import {
  createDirectInput,
  DIRECT_INPUT,
} from '@attendance/domain/models/AttPattern';
import * as SubstituteLeaveType from '@attendance/domain/models/SubstituteLeaveType';

import Factory from '../ForEditing';
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
    ${{}}                          | ${null}         | ${undefined}
    ${{}}                          | ${''}           | ${undefined}
    ${{}}                          | ${'2023-01-01'} | ${undefined}
    ${{ startDate: '2023-02-02' }} | ${null}         | ${'2023-02-02'}
    ${{ startDate: '2023-02-02' }} | ${''}           | ${'2023-02-02'}
    ${{ startDate: '2023-02-02' }} | ${'2023-01-01'} | ${'2023-02-02'}
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
    request | workingType                           | expected
    ${{}}   | ${null}                               | ${{ startTime: undefined, endTime: undefined }}
    ${{}}   | ${{ startTime: null, endTime: null }} | ${{ startTime: undefined, endTime: undefined }}
    ${{}}   | ${{ startTime: 0, endTime: 0 }}       | ${{ startTime: undefined, endTime: undefined }}
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
    request                        | employeeId      | expected
    ${{}}                          | ${null}         | ${{ employeeId: null, targetDate: undefined }}
    ${{}}                          | ${'employeeId'} | ${{ employeeId: 'employeeId', targetDate: undefined }}
    ${{ startDate: '2023-02-02' }} | ${null}         | ${{ employeeId: null, targetDate: '2023-02-02' }}
    ${{ startDate: '2023-02-02' }} | ${'employeeId'} | ${{ employeeId: 'employeeId', targetDate: '2023-02-02' }}
  `('should set patterns', async ({ request, employeeId, expected }) => {
    (AttPatternRepository.fetch as jest.Mock).mockResolvedValue({
      patterns: [{ code: 'test' }],
    });
    const directInput = createDirectInput(patternName[DIRECT_INPUT], null);
    const result = await Factory(repositories)({
      employeeId,
      workingType: { useHolidayWorkPatternApply: true },
      patternName,
    } as unknown as Parameters<ReturnType<typeof Factory>>[0]).create(request);
    expect(result.patterns).toEqual([directInput, { code: 'test' }]);
    expect(AttPatternRepository.fetch).toHaveBeenCalledWith(expected);
  });

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
    ${{}}   | ${null}      | ${null}
    ${{}}   | ${null}      | ${'workingType'}
    ${{}}   | ${'dayType'} | ${null}
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
