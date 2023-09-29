import Api from '../../../../../__tests__/mocks/ApiMock';
import submit from '../submit';

it('should do submit.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await submit({
    requestId: 'ahueu348',
    summaryId: 'nue48ur8394',
    requestType: 'Monthly',
    changedOvertimeHoursLimit: 0,
    reason: 'reason',
    measures: 'measures',
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/request/legal-agreement/submit',
    param: {
      requestId: 'ahueu348',
      summaryId: 'nue48ur8394',
      requestType: 'Monthly',
      changedOvertimeHoursLimit: 0,
      reason: 'reason',
      measures: 'measures',
    },
  });
});
