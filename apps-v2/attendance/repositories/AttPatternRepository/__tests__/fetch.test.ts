import snapshotDiff from 'snapshot-diff';

import MockApi from '../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import { workDayAndAllowedDirect } from './mocks/fetch.mock';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(workDayAndAllowedDirect);

  // Act
  const result = await fetch({ targetDate: '2023-02-01' });

  // Assert
  expect(snapshotDiff(workDayAndAllowedDirect, result)).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/daily-pattern/list',
    param: {
      targetDate: '2023-02-01',
      empId: '',
      ignoredId: '',
    },
  });
});

it.each`
  param                                                                        | expected
  ${{ targetDate: 'targetDate' }}                                              | ${{ targetDate: 'targetDate', empId: '', ignoredId: '' }}
  ${{ targetDate: 'targetDate', employeeId: 'empId' }}                         | ${{ targetDate: 'targetDate', empId: 'empId', ignoredId: '' }}
  ${{ targetDate: 'targetDate', ignoredId: 'ignoredId' }}                      | ${{ targetDate: 'targetDate', empId: '', ignoredId: 'ignoredId' }}
  ${{ targetDate: 'targetDate', employeeId: 'empId', ignoredId: 'ignoredId' }} | ${{ targetDate: 'targetDate', empId: 'empId', ignoredId: 'ignoredId' }}
`('should do with param', async ({ param, expected }) => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(workDayAndAllowedDirect);

  // Act
  await fetch(param);

  // Assert
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/daily-pattern/list',
    param: expected,
  });
});
