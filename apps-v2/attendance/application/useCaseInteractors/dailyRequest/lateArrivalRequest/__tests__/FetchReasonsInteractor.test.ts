import LateArrivalReasonRepository from '@attendance/application/__tests__/mocks/repositories/LateArrivalReasonRepository';

import interactor from '../FetchReasonsUseCaseInteractor';

const mockFetch = LateArrivalReasonRepository.fetchList as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({
  LateArrivalReasonRepository,
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
    reasons: 'record',
  });
  expect(LateArrivalReasonRepository.fetchList).toBeCalledTimes(1);
  expect(LateArrivalReasonRepository.fetchList).toBeCalledWith({
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
    reasons: 'record',
  });
  expect(LateArrivalReasonRepository.fetchList).toBeCalledTimes(1);
  expect(LateArrivalReasonRepository.fetchList).toBeCalledWith({
    targetDate: '2022-06-21',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
