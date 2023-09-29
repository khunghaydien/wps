import Api from '../../../../../__tests__/mocks/ApiMock';
import cancelApproval from '../cancelApproval';

it('should do cancelApproval.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await cancelApproval({ requestId: 'abc' });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/legal-agreement/cancel-approval',
    param: { requestId: 'abc' },
  });
});
