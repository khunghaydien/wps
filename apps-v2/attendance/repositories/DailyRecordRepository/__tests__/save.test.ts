import { defaultValue } from '@attendance/domain/models/__tests__/mocks/AttDailyRecord/DailyAttendanceTime.mock';

import Api from '../../../../../__tests__/mocks/ApiMock';
import save from '../save';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await save(defaultValue);

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi.mock.calls[0]).toMatchSnapshot();
});

it('should not send commute count .', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await save({ ...defaultValue, commuteCount: null });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi.mock.calls[0][0].param.commuteCount).toEqual(null);
});
