import Api from '../../../../../__tests__/mocks/ApiMock';
import submit from '../submit';

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await submit('recordId');

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/fix-daily/submit',
    param: {
      recordId: 'recordId',
    },
  });
});
