import Api from '../../../../../__tests__/mocks/ApiMock';
import fetchList from '../fetchList';

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue({ earlyLeaveReasons: 'response' });

  // Act
  const result = await fetchList({
    targetDate: '2022-02-22',
    employeeId: 'employeeId',
  });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-early-leave-reason/list',
    param: {
      targetDate: '2022-02-22',
      empId: 'employeeId',
    },
  });
});
