import Api from '../../../../../__tests__/mocks/ApiMock';
import search from '../search';
import { defaultValue } from './mocks/search.mock';

it('should return dailyRestList', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(defaultValue);

  // Act
  const dailyRestList = await search({
    employeeId: 'employeeId',
    startDate: '2022-07-01',
    endDate: '2022-07-31',
  });

  // Assert
  expect(dailyRestList).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-rest/get',
    param: {
      empId: 'employeeId',
      startDate: '2022-07-01',
      endDate: '2022-07-31',
    },
  });
});
