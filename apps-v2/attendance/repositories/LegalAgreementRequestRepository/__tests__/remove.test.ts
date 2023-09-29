import Api from '../../../../../__tests__/mocks/ApiMock';
import remove from '../remove';

it('should do remove.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce(true);

  // Act
  const response = await remove({ requestId: 'abc' });

  // Assert
  expect(response).toBe(true);
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/legal-agreement/remove',
    param: { requestId: 'abc' },
  });
});
