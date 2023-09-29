import Api from '../../../../../__tests__/mocks/ApiMock';
import cancelSubmitted from '../cancelSubmitted';

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await cancelSubmitted('requestId');

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/fix-daily/cancel-approval',
    param: {
      requestId: 'requestId',
    },
  });
});
