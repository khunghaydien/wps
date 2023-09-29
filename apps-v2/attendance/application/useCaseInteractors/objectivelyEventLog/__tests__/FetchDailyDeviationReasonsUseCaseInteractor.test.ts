import DailyObjectivelyEventLogDeviationReasonRepository from '@attendance/application/__tests__/mocks/repositories/DailyObjectivelyEventLogDeviationReasonRepository';

import interactor from '../FetchDailyDeviationReasonsUseCaseInteractor';

const mockFetch =
  DailyObjectivelyEventLogDeviationReasonRepository.fetchList as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({
  DailyObjectivelyEventLogDeviationReasonRepository,
})(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call fetch with employeeId', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    targetDate: '2022-06-21',
  };
  mockFetch.mockResolvedValueOnce({
    id: 'id',
    deviationReasons: 'deviationReasons',
  });

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: 'employeeId',
    targetDate: '2022-06-21',
    id: 'id',
    deviationReasons: 'deviationReasons',
  });
  expect(
    DailyObjectivelyEventLogDeviationReasonRepository.fetchList
  ).toBeCalledTimes(1);
  expect(
    DailyObjectivelyEventLogDeviationReasonRepository.fetchList
  ).toBeCalledWith({
    employeeId: 'employeeId',
    targetDate: '2022-06-21',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call fetch without employeeId', async () => {
  // Arrange
  const input = {
    targetDate: '2022-06-21',
  };
  mockFetch.mockResolvedValueOnce({
    id: 'id',
    deviationReasons: 'deviationReasons',
  });

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: undefined,
    targetDate: '2022-06-21',
    id: 'id',
    deviationReasons: 'deviationReasons',
  });
  expect(
    DailyObjectivelyEventLogDeviationReasonRepository.fetchList
  ).toBeCalledTimes(1);
  expect(
    DailyObjectivelyEventLogDeviationReasonRepository.fetchList
  ).toBeCalledWith({
    targetDate: '2022-06-21',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
