import Api from '../../../../../__tests__/mocks/ApiMock';
import saveRemarks from '../saveRemarks';

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await saveRemarks({
    recordId: 'RECORD_ID',
    remarks: 'REMARKS',
  });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-remarks/save',
    param: {
      recordId: 'RECORD_ID',
      remarks: 'REMARKS',
    },
  });
});
