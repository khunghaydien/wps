import { defaultValue } from '../../models/__tests__/mocks/DailyObjectivelyEventLog.mock';

import Api from '../../../../../__tests__/mocks/ApiMock';
import search from '../search';

it('should return DailyObjectivelyEventLog', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce({
    dailyRecordList: defaultValue,
  });

  // Act
  const eventLogs = await search({
    employeeId: 'employeeId',
    startDate: '2020-01-01',
    endDate: '2020-01-31',
  });

  // Assert
  expect(eventLogs).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-objectively-event-log/get',
    param: {
      empId: 'employeeId',
      startDate: '2020-01-01',
      endDate: '2020-01-31',
    },
  });
});
