import Api from '../../../../../__tests__/mocks/ApiMock';
import cancelRequest from '../cancelRequest';

it('should do cancelRequest.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await cancelRequest({ requestId: 'abc' });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/legal-agreement/cancel-request',
    param: { requestId: 'abc' },
  });
});
