import * as actions from '../../actions';

import LocalEvents from '../../events';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('../../events');
jest.mock('@attendance/timesheet-pc/UseCases');

type Input = Parameters<typeof actions['cancelApproval']>;

beforeEach(() => {
  jest.clearAllMocks();
});

it('should execute', async () => {
  // Arrange
  const input = ['record'] as unknown as Input;

  // Act
  const result = await actions.cancelApproval(...input);

  // Act
  expect(result).toBe(undefined);
  expect(UseCases().cancelApprovalFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases().cancelApprovalFixDailyRequest).toBeCalledWith('record');
  expect(LocalEvents.canceledApprovalRequest.publish).toBeCalledTimes(1);
  expect(LocalEvents.canceledApprovalRequest.publish).toBeCalledWith();
});

it('should occur error', async () => {
  // Arrange
  const input = ['record'] as unknown as Input;
  (
    UseCases().cancelApprovalFixDailyRequest as unknown as jest.Mock
  ).mockRejectedValue('error');

  // Act
  const result = actions.cancelApproval(...input);

  // Act
  await expect(result).rejects.toBe('error');
  expect(UseCases().cancelApprovalFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases().cancelApprovalFixDailyRequest).toBeCalledWith('record');
  expect(LocalEvents.canceledApprovalRequest.publish).toBeCalledTimes(0);
});
