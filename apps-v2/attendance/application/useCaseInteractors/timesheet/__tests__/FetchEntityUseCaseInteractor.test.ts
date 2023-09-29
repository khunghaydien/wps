/**
 * IFetchUseCase が変換されてたエンティティを返すようになったらこのファイルは削除されます。
 */
import TimesheetRepository from '@attendance/application/__tests__/mocks/repositories/TimesheetRepository';

import interactor from '../FetchEntityUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const mockFetch = TimesheetRepository.fetch as unknown as jest.Mock;

const UseCase = interactor({ TimesheetRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do without parameters', async () => {
  // Arrange
  const timesheet = {
    isMigratedSummary: false,
  };
  mockFetch.mockResolvedValue(timesheet);

  // Act
  const result = await UseCase();

  // Assert
  const output = {
    employeeId: undefined,
    timesheet,
  };
  expect(result).toEqual(output);
  expect(TimesheetRepository.fetch).toBeCalledTimes(1);
  expect(TimesheetRepository.fetch).toBeCalledWith(undefined, undefined);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should throw error if repository throws error.', async () => {
  // Arrange
  mockFetch.mockRejectedValue('error');

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
