import Api from '../../../../../__tests__/mocks/ApiMock';
import reapply from '../reapply';

it('should do submit.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await reapply({
    originalRequestId: 'rg655657',
    requestId: 'ahueu348',
    changedOvertimeHoursLimit: 0,
    reason: 'reason',
    measures: 'measures',
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/legal-agreement/reapply',
    param: {
      originalRequestId: 'rg655657',
      requestId: 'ahueu348',
      changedOvertimeHoursLimit: 0,
      reason: 'reason',
      measures: 'measures',
    },
  });
});
