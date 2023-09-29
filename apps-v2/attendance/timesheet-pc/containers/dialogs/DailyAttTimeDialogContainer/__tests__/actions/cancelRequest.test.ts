import * as actions from '../../actions';

import LocalEvents from '../../events';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('../../events');
jest.mock('@attendance/timesheet-pc/UseCases');

type Input = Parameters<typeof actions['cancelRequest']>;

beforeEach(() => {
  jest.clearAllMocks();
});

it('should execute', async () => {
  // Arrange
  const input = ['record'] as unknown as Input;

  // Act
  const result = await actions.cancelRequest(...input);

  // Act
  expect(result).toBe(undefined);
  expect(UseCases().cancelSubmittedFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases().cancelSubmittedFixDailyRequest).toBeCalledWith('record');
  expect(LocalEvents.canceledSubmittedRequest.publish).toBeCalledTimes(1);
  expect(LocalEvents.canceledSubmittedRequest.publish).toBeCalledWith();
});

it('should occur error', async () => {
  // Arrange
  const input = ['record'] as unknown as Input;
  (
    UseCases().cancelSubmittedFixDailyRequest as unknown as jest.Mock
  ).mockRejectedValue('error');

  // Act
  const result = actions.cancelRequest(...input);

  // Act
  await expect(result).rejects.toBe('error');
  expect(UseCases().cancelSubmittedFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases().cancelSubmittedFixDailyRequest).toBeCalledWith('record');
  expect(LocalEvents.canceledSubmittedRequest.publish).toBeCalledTimes(0);
});
