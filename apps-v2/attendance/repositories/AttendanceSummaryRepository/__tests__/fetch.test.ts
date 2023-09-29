import snapshotDiff from 'snapshot-diff';

import MockApi from '../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import { defaultValue } from './mocks/fetch.mock';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(defaultValue);

  // Act
  const result = await fetch();

  // Assert
  expect(snapshotDiff(defaultValue, result)).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/summary/get',
    param: {
      empId: undefined,
      targetDate: undefined,
    },
  });
});

it.each`
  param                                                | expected
  ${{}}                                                | ${{}}
  ${{ employeeId: 'empId' }}                           | ${{ empId: 'empId' }}
  ${{ targetDate: 'targetDate' }}                      | ${{ targetDate: 'targetDate' }}
  ${{ employeeId: 'empId', targetDate: 'targetDate' }} | ${{ empId: 'empId', targetDate: 'targetDate' }}
`('should do with param', async ({ param, expected }) => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(defaultValue);

  // Act
  await fetch(param);

  // Assert
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/summary/get',
    param: expected,
  });
});
