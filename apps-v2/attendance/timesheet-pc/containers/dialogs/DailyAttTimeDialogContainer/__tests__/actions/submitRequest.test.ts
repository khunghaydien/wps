import * as actions from '../../actions';

import LocalEvents from '../../events';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('../../events');
jest.mock('@attendance/timesheet-pc/UseCases');

type Input = Parameters<typeof actions['submitRequest']>;

beforeEach(() => {
  jest.clearAllMocks();
});

it.each([false, true])('should publish %s if result is %s', async (value) => {
  // Arrange
  const input = ['record'] as unknown as Input;
  (UseCases().submitFixDailyRequest as unknown as jest.Mock).mockResolvedValue({
    result: value,
  });

  // Act
  const result = await actions.submitRequest(...input);

  // Act
  expect(result).toBe(undefined);
  expect(UseCases().submitFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases().submitFixDailyRequest).toBeCalledWith('record');
  expect(LocalEvents.submittedRequest.publish).toBeCalledTimes(1);
  expect(LocalEvents.submittedRequest.publish).toBeCalledWith(value);
});

it('should publish false if error is occurred.', async () => {
  // Arrange
  const input = ['record'] as unknown as Input;
  (UseCases().submitFixDailyRequest as unknown as jest.Mock).mockRejectedValue(
    'error'
  );

  // Act
  const result = await actions.submitRequest(...input);

  // Act
  expect(result).toBe(undefined);
  expect(UseCases().submitFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases().submitFixDailyRequest).toBeCalledWith('record');
  expect(LocalEvents.submittedRequest.publish).toBeCalledTimes(1);
  expect(LocalEvents.submittedRequest.publish).toBeCalledWith(false);
});
