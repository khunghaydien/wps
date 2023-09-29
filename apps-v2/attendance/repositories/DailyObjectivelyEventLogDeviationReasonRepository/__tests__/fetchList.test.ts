import Api from '../../../../../__tests__/mocks/ApiMock';
import fetchList from '../fetchList';
import { defaultValue } from './mocks/fetchList.mock';

it('should return RestTimeReasonList', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(defaultValue);

  // Act
  const restReasons = await fetchList({
    employeeId: 'employeeId',
    targetDate: '2022-06-21',
  });

  // Assert
  expect(restReasons).toMatchSnapshot();
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/objectively-event-log/deviated-reason/list',
    param: {
      empId: 'employeeId',
      targetDate: '2022-06-21',
    },
  });
});
