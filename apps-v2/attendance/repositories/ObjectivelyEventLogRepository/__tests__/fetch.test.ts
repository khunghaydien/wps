import Api from '../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import { defaultValue } from './mocks/fetch.mock';

it('should return DailyObjectivelyEventLog', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(defaultValue);

  // Act
  const eventLogs = await fetch({
    employeeId: 'employeeId',
    targetDate: '2020-01-01',
  });

  // Assert
  expect(eventLogs).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/objectively-event-log/get',
    param: {
      empId: 'employeeId',
      targetDate: '2020-01-01',
    },
  });
});
