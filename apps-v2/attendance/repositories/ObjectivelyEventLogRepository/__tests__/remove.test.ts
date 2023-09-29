import Api from '../../../../../__tests__/mocks/ApiMock';
import remove from '../remove';

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await remove('abc');

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/objectively-event-log/delete',
    param: { id: 'abc' },
  });
});
