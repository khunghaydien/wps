import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import Factory from '../Default';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('create', () => {
  it.each`
    request                | expected
    ${{}}                  | ${'A'}
    ${{ leaveRange: 'A' }} | ${'A'}
    ${{ leaveRange: 'B' }} | ${'B'}
  `('should set leaveRange', ({ request, expected }) => {
    const leaves = createMapByCode([
      { code: 'TEST', ranges: ['A', 'B', 'C'] },
      { code: 'TEST', ranges: ['A', 'B', 'C'] },
      { code: 'TEST', ranges: ['A', 'B', 'C'] },
    ]);
    const result = Factory().create({ ...request, leaves });
    expect(result.leaveRange).toEqual(expected);
  });

  it.each`
    request                                                  | expected
    ${{}}                                                    | ${null}
    ${{ leaveCode: '', leaveDetailCode: '' }}                | ${null}
    ${{ leaveCode: '', leaveDetailCode: 'ABC' }}             | ${null}
    ${{ leaveCode: '', leaveDetailCode: 'TEST_DETAIL' }}     | ${'TEST_DETAIL'}
    ${{ leaveCode: 'TEST', leaveDetailCode: 'TEST_DETAIL' }} | ${'TEST_DETAIL'}
  `('should set leaveDetailCode', ({ request, expected }) => {
    const leaves = createMapByCode([
      {
        code: 'TEST',
        details: createMapByCode([{ code: 'TEST_DETAIL' }]),
      },
    ]);
    const result = Factory().create({ ...request, leaves });
    expect(result.leaveDetailCode).toEqual(expected);
  });

  it.each`
    request                   | expected
    ${{}}                     | ${'TEST1'}
    ${{ leaveCode: 'ABC' }}   | ${'TEST1'}
    ${{ leaveCode: 'TEST2' }} | ${'TEST2'}
  `('should set leaveCode', ({ request, expected }) => {
    const leaves = createMapByCode([
      { code: 'TEST1' },
      { code: 'TEST2' },
      { code: 'TEST3' },
    ]);
    const result = Factory().create({ ...request, leaves });
    expect(result.leaveCode).toEqual(expected);
  });
});

describe('updateByKeyValue', () => {
  it('should update', () => {
    const request = Factory().updateByKeyValue(
      {} as unknown as Parameters<
        ReturnType<typeof Factory>['updateByKeyValue']
      >[0],
      'id',
      'TEST'
    );
    expect(request.id).toEqual('TEST');
  });
});
