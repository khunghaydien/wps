import Api from '../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetchList';
import { defaultValue } from './mocks/fetchList';

it('should return leaves', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(defaultValue);

  // Act
  const dailyRestList = await fetch({
    employeeId: 'employeeId',
    targetDate: '2022-07-01',
    ignoredId: '0001',
  });

  // Assert
  expect(dailyRestList).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-leave/list',
    param: {
      empId: 'employeeId',
      targetDate: '2022-07-01',
      ignoredId: '0001',
    },
  });
});
