import ObjectivelyEventLogRepository from '@attendance/application/__tests__/mocks/repositories/ObjectivelyEventLogRepository';

import interactor from '../FetchUseCaseInteractor';

const mockFetch = ObjectivelyEventLogRepository.fetch as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ ObjectivelyEventLogRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call fetch with employeeId', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
  };
  mockFetch.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
    objectivelyEventLogs: 'record',
  });
  expect(ObjectivelyEventLogRepository.fetch).toBeCalledTimes(1);
  expect(ObjectivelyEventLogRepository.fetch).toBeCalledWith({
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call fetch without employeeId', async () => {
  // Arrange
  const input = {
    targetDate: '2022-02-01',
  };
  mockFetch.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: undefined,
    targetDate: '2022-02-01',
    objectivelyEventLogs: 'record',
  });
  expect(ObjectivelyEventLogRepository.fetch).toBeCalledTimes(1);
  expect(ObjectivelyEventLogRepository.fetch).toBeCalledWith({
    targetDate: '2022-02-01',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
