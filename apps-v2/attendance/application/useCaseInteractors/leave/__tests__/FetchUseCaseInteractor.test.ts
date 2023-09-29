import LeaveRepository from '@attendance/application/__tests__/mocks/repositories/LeaveRepository';

import interactor from '../FetchListUseCaseInteractor';

const mockFetchList = LeaveRepository.fetchList as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ LeaveRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call fetch with employeeId', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
    ignoreId: 'ignoreId',
  };
  mockFetchList.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
    ignoreId: 'ignoreId',
    leaves: 'record',
  });
  expect(LeaveRepository.fetchList).toBeCalledTimes(1);
  expect(LeaveRepository.fetchList).toBeCalledWith({
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
    ignoreId: 'ignoreId',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call fetch without employeeId and ignoredId', async () => {
  // Arrange
  const input = {
    targetDate: '2022-02-01',
  };
  mockFetchList.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    targetDate: '2022-02-01',
    leaves: 'record',
  });
  expect(LeaveRepository.fetchList).toBeCalledTimes(1);
  expect(LeaveRepository.fetchList).toBeCalledWith({
    targetDate: '2022-02-01',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
