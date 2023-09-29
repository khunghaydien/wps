import Api from '../../../../../__tests__/mocks/ApiMock';
import setToBeApplied from '../setToBeApplied';

it('should do', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await setToBeApplied({
    id: 'DAILY_RECORD_ID',
    records: [
      {
        enteringId: 'RECORD_ID_1',
        leavingId: 'RECORD_ID_2',
      },
      {
        enteringId: 'RECORD_ID_3',
        leavingId: 'RECORD_ID_4',
      },
      {
        enteringId: 'RECORD_ID_5',
        leavingId: 'RECORD_ID_6',
      },
    ],
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-objectively-event-log/event-log/update',
    param: {
      id: 'DAILY_RECORD_ID',
      enteringEventLogId1: 'RECORD_ID_1',
      leavingEventLogId1: 'RECORD_ID_2',
      enteringEventLogId2: 'RECORD_ID_3',
      leavingEventLogId2: 'RECORD_ID_4',
      enteringEventLogId3: 'RECORD_ID_5',
      leavingEventLogId3: 'RECORD_ID_6',
    },
  });
});
