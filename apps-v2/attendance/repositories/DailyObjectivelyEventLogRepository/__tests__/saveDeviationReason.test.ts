import Api from '../../../../../__tests__/mocks/ApiMock';
import saveDeviationReason from '../saveDeviationReason';

it('should return DailyObjectivelyEventLog', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await saveDeviationReason({
    id: 'dailyObjectivelyEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Entering Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Leaving Reason',
    },
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-objectively-event-log/deviated-reason/update',
    param: {
      id: 'dailyObjectivelyEventLogId',
      deviatedEnteringTimeReason: 'Entering Reason',
      deviatedEnteringTimeReasonSelectedLabel: null,
      deviatedEnteringTimeReasonSelectedValue: null,
      deviatedLeavingTimeReason: 'Leaving Reason',
      deviatedLeavingTimeReasonSelectedLabel: null,
      deviatedLeavingTimeReasonSelectedValue: null,
      deviationReasonExtendedItemId: '',
    },
  });
});
