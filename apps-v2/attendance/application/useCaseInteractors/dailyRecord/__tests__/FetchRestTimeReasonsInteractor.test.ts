import RestTimeReasonRepository from '@attendance/application/__tests__/mocks/repositories/RestTimeReasonRepository';

import interactor from '../FetchRestTimeReasonsUseCaseInteractor';

const mockFetch = RestTimeReasonRepository.fetchList as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({
  RestTimeReasonRepository,
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
  mockFetch.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: 'employeeId',
    targetDate: '2022-06-21',
    restReasons: 'record',
  });
  expect(RestTimeReasonRepository.fetchList).toBeCalledTimes(1);
  expect(RestTimeReasonRepository.fetchList).toBeCalledWith({
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
  mockFetch.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: undefined,
    targetDate: '2022-06-21',
    restReasons: 'record',
  });
  expect(RestTimeReasonRepository.fetchList).toBeCalledTimes(1);
  expect(RestTimeReasonRepository.fetchList).toBeCalledWith({
    targetDate: '2022-06-21',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
