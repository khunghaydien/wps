import Api from '../../../../../../__tests__/mocks/ApiMock';
import getAnnualLeaveAdjuset from '../getAnnualLeaveAdjuset';

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await getAnnualLeaveAdjuset({
    grantId: 'grantId',
    employeeId: 'employeeId',
  });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi.mock.calls[0]).toMatchSnapshot();
});
