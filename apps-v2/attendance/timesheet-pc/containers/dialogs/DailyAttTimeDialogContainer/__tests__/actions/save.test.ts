import * as actions from '../../actions';

import LocalEvents from '../../events';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('../../events');
jest.mock('@attendance/timesheet-pc/UseCases');

type Input = Parameters<typeof actions['save']>;

beforeEach(() => {
  jest.clearAllMocks();
});

it('should execute', async () => {
  // Arrange
  const input = ['record'] as unknown as Input;

  // Act
  const result = await actions.save(...input);

  // Act
  expect(result).toBe(undefined);
  expect(UseCases().saveDailyRecord).toBeCalledTimes(1);
  expect(UseCases().saveDailyRecord).toBeCalledWith('record');
  expect(LocalEvents.saved.publish).toBeCalledTimes(1);
  expect(LocalEvents.saved.publish).toBeCalledWith(true);
});

it('should not occur errors', async () => {
  // Arrange
  const input = ['record'] as unknown as Input;
  (UseCases().saveDailyRecord as unknown as jest.Mock).mockRejectedValue(
    'error'
  );

  // Act
  const result = await actions.save(...input);

  // Act
  expect(result).toBe(undefined);
  expect(UseCases().saveDailyRecord).toBeCalledTimes(1);
  expect(UseCases().saveDailyRecord).toBeCalledWith('record');
  expect(LocalEvents.saved.publish).toBeCalledTimes(1);
  expect(LocalEvents.saved.publish).toBeCalledWith(false);
});
