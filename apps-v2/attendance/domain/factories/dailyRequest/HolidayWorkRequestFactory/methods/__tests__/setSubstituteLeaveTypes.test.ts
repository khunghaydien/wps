import createSubstituteLeaveTypesFactory from '../../SubstituteLeaveTypesFactory';
import method from '../setSubstituteLeaveTypes';

jest.mock('../../SubstituteLeaveTypesFactory', () => {
  const factory = {
    create: jest.fn(),
  };
  return {
    __esModule: true,
    default: () => factory,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
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
    (SubstituteLeaveTypesFactory.create as jest.Mock).mockReturnValue('result');
    const result = await method({
      dayType,
      workingType,
    })(request);
    expect(result.substituteLeaveTypes).toEqual('result');
    expect(SubstituteLeaveTypesFactory.create).toHaveBeenCalledWith({
      request,
      workingType,
      dayType,
    });
  }
);
