import { EVENT_TYPE } from '@attendance/domain/models/ObjectivelyEventLogRecord';

import Api from '../../../../../__tests__/mocks/ApiMock';
import create from '../create';
import { time } from '@apps/attendance/__tests__/helpers';

it('should convert parameter.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await create({
    employeeId: 'employeeId',
    targetDate: '2020-01-01',
    settingCode: 'ABCD',
    eventType: EVENT_TYPE.LEAVING,
    time: time(7),
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/objectively-event-log/create',
    param: {
      empId: 'employeeId',
      targetDate: '2020-01-01',
      objectivelyEventLogSettingCode: 'ABCD',
      eventType: EVENT_TYPE.LEAVING,
      eventTime: time(7),
    },
  });
});
