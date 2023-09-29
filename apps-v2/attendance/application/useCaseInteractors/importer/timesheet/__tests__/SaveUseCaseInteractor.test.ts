import TimesheetRepository from '@attendance/application/__tests__/mocks/repositories/importer/TimesheetRepository';

import { allDummyValue } from '@attendance/domain/models/importer/__tests__/mocks/Timesheet.mock';
import { DailyRecord } from '@attendance/domain/models/importer/DailyRecord';
import { REASON } from '@attendance/domain/models/Result';

import interactor from '../SaveUseCaseInteractor';

const mockSave = TimesheetRepository.save as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({
  ImporterTimesheetRepository: TimesheetRepository,
})(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should return true if parameter has records. ', async () => {
  // Arrange
  const input = allDummyValue;
  mockSave.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({ result: true, value: undefined });
  expect(TimesheetRepository.save).toHaveBeenCalledTimes(1);
  expect(TimesheetRepository.save).toHaveBeenCalledWith(input);
});

it.each<DailyRecord[][]>([undefined, null, []])(
  'should return false if parameter has not records. ',
  async (records) => {
    // Arrange
    mockSave.mockResolvedValueOnce('record');

    // Act
    const result = await UseCase({
      ...allDummyValue,
      records,
    });

    // Assert
    expect(result).toEqual({ result: false, reason: REASON.NO_RECORD });
    expect(TimesheetRepository.save).toHaveBeenCalledTimes(0);
  }
);
