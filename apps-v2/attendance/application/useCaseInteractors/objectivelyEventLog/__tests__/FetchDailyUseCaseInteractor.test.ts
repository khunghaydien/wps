import DailyObjectivelyEventLogRepository from '@attendance/application/__tests__/mocks/repositories/DailyObjectivelyEventLogRepository';

import interactor from '../FetchDailyUseCaseInteractor';

const mockSearch =
  DailyObjectivelyEventLogRepository.search as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ DailyObjectivelyEventLogRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call search with employeeId', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  };
  mockSearch.mockResolvedValueOnce(['record']);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: 'employeeId',
    startDate: '2022-02-01',
    endDate: '2022-02-28',
    dailyObjectivelyEventLogs: ['record'],
  });
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledWith({
    employeeId: 'employeeId',
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call search without employeeId', async () => {
  // Arrange
  const input = {
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  };
  mockSearch.mockResolvedValueOnce(['record']);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: undefined,
    startDate: '2022-02-01',
    endDate: '2022-02-28',
    dailyObjectivelyEventLogs: ['record'],
  });
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledWith({
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should return null if searched records is 0', async () => {
  // Arrange
  const input = {
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  };
  mockSearch.mockResolvedValueOnce([]);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: undefined,
    startDate: '2022-02-01',
    endDate: '2022-02-28',
    dailyObjectivelyEventLogs: [],
  });
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledWith({
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should return null if searched records is null', async () => {
  // Arrange
  const input = {
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  };
  mockSearch.mockResolvedValueOnce(null);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: undefined,
    startDate: '2022-02-01',
    endDate: '2022-02-28',
    dailyObjectivelyEventLogs: null,
  });
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.search).toBeCalledWith({
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
