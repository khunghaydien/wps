import snapshotDiff from 'snapshot-diff';

import Api from '../../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import { defaultValue } from './mocks/fetch.mock';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should execute', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue(defaultValue);

  // Act
  const result = await fetch({
    employeeId: 'employeeId',
    startDate: 'startDate',
    endDate: 'endDate',
  });

  // Assert
  expect(MockApi).toHaveBeenCalledTimes(1);
  expect(MockApi).toHaveBeenCalledWith({
    path: '/att/timesheet-import/default/get',
    param: {
      empId: 'employeeId',
      startDate: 'startDate',
      endDate: 'endDate',
    },
  });
  expect(snapshotDiff(defaultValue.summaryList, result)).toMatchSnapshot();
});
