import TimesheetRepository from '@attendance/application/__tests__/mocks/repositories/TimesheetRepository';

import interactor from '../FetchUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const mockFetchRaw = TimesheetRepository.fetchRaw as unknown as jest.Mock;

const UseCase = interactor({ TimesheetRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do without parameters', async () => {
  // Arrange
  const timesheet = {
    isMigratedSummary: false,
  };
  mockFetchRaw.mockResolvedValue(timesheet);

  // Act
  const result = await UseCase();

  // Assert
  const output = {
    employeeId: undefined,
    timesheet,
  };
  expect(result).toEqual(output);
  expect(TimesheetRepository.fetchRaw).toBeCalledTimes(1);
  expect(TimesheetRepository.fetchRaw).toBeCalledWith(undefined, undefined);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should throw error if repository throws error.', async () => {
  // Arrange
  mockFetchRaw.mockRejectedValue('error');

  // Act
  const result = UseCase({
    targetDate: '2022-01-01',
    employeeId: 'employeeId',
  });

  // Assert
  await expect(result).rejects.toBe('error');
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
