import * as actions from '../../actions';

import LocalEvents from '../../events';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('../../events');
jest.mock('@attendance/timesheet-pc/UseCases');

type Input = Parameters<typeof actions['saveAndSubmitFixDailyRequest']>[0];

beforeEach(() => {
  jest.clearAllMocks();
});

it.each([true, false])('should publish %s', async (value) => {
  // Arrange
  (
    UseCases().submitFixDailyRequestAndSaveDailyRecord as unknown as jest.Mock
  ).mockResolvedValue(value);

  // Act
  const result = await actions.saveAndSubmitFixDailyRequest(
    'input' as unknown as Input
  );

  // Assert
  expect(result).toBe(undefined);
  expect(UseCases().submitFixDailyRequestAndSaveDailyRecord).toBeCalledTimes(1);
  expect(UseCases().submitFixDailyRequestAndSaveDailyRecord).toBeCalledWith(
    'input'
  );
  expect(LocalEvents.submittedRequest.publish).toBeCalledWith(value);
});
