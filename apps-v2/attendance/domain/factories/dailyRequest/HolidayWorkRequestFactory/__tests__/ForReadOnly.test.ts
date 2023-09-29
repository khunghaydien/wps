import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import {
  createDirectInput,
  DIRECT_INPUT,
} from '@attendance/domain/models/AttPattern';
import * as SubstituteLeaveType from '@attendance/domain/models/SubstituteLeaveType';

import Factory from '../ForReadOnly';
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

const { SUBSTITUTE_LEAVE_TYPE: SLT } = SubstituteLeaveType;

const patternName = {
  [DIRECT_INPUT]: 'Direct Input',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('convertForReadOnly', () => {
  it('should set direct input pattern to patterns', async () => {
    const result = Factory({
      dayType: null,
      workingType: null,
      patternName,
    }).create({} as unknown as HolidayWorkRequest.HolidayWorkRequest);
    expect(result.patterns).toEqual([
      createDirectInput(patternName[DIRECT_INPUT], null),
    ]);
  });

  it.each`
    request                                    | dayType      | workingType      | expected
    ${{}}                                      | ${null}      | ${null}          | ${['result', SLT.None]}
    ${{}}                                      | ${null}      | ${'workingType'} | ${['result', SLT.None]}
    ${{}}                                      | ${'dayType'} | ${null}          | ${['result', SLT.None]}
    ${{}}                                      | ${'dayType'} | ${'workingType'} | ${['result', SLT.None]}
    ${{ substituteLeaveType: 'result' }}       | ${'dayType'} | ${'workingType'} | ${['result']}
    ${{ substituteLeaveType: SLT.Substitute }} | ${'dayType'} | ${'workingType'} | ${['result', SLT.Substitute]}
  `(
    'should set default substituteLeaveTypes',
    ({ request, dayType, workingType, expected }) => {
      const SubstituteLeaveTypesFactory = createSubstituteLeaveTypesFactory();
      (SubstituteLeaveTypesFactory.create as jest.Mock).mockReturnValue([
        'result',
      ]);
      const result = Factory({
        dayType,
        workingType,
        patternName,
      }).create(request);
      expect(result.substituteLeaveTypes).toEqual(expected);
      expect(SubstituteLeaveTypesFactory.create).toHaveBeenCalledWith({
        request: {
          substituteLeaveType: request.substituteLeaveType || SLT.None,
        },
        workingType,
        dayType,
      });
    }
  );

  it.each`
    request                                    | expected
    ${{}}                                      | ${SLT.None}
    ${{ substituteLeaveType: SLT.Substitute }} | ${SLT.Substitute}
  `('should set default substituteLeaveType', ({ request, expected }) => {
    const result = Factory({
      dayType: null,
      workingType: null,
      patternName,
    }).create(request);
    expect(result.substituteLeaveType).toEqual(expected);
  });
});
