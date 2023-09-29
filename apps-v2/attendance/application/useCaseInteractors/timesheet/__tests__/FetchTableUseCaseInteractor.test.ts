import DailyRecordDisplayFieldLayoutRepository from '@attendance/application/__tests__/mocks/repositories/DailyRecordDisplayFieldLayoutRepository';

import interactor from '../FetchTableUseCaseInteractor';

const mockFetch =
  DailyRecordDisplayFieldLayoutRepository.fetchTable as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ DailyRecordDisplayFieldLayoutRepository })(
  Presenter
);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call fetchTable with employeeId', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    startDate: '2022-12-01',
    endDate: '2022-12-31',
  };
  mockFetch.mockResolvedValueOnce('layoutTable');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: 'employeeId',
    startDate: '2022-12-01',
    endDate: '2022-12-31',
    layoutTable: 'layoutTable',
  });
  expect(DailyRecordDisplayFieldLayoutRepository.fetchTable).toBeCalledTimes(1);
  expect(DailyRecordDisplayFieldLayoutRepository.fetchTable).toBeCalledWith({
    employeeId: 'employeeId',
    startDate: '2022-12-01',
    endDate: '2022-12-31',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call fetchTable without employeeId', async () => {
  // Arrange
  const input = {
    startDate: '2022-12-01',
    endDate: '2022-12-31',
  };
  mockFetch.mockResolvedValueOnce('layoutTable');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    employeeId: undefined,
    startDate: '2022-12-01',
    endDate: '2022-12-31',
    layoutTable: 'layoutTable',
  });
  expect(DailyRecordDisplayFieldLayoutRepository.fetchTable).toBeCalledTimes(1);
  expect(DailyRecordDisplayFieldLayoutRepository.fetchTable).toBeCalledWith({
    startDate: '2022-12-01',
    endDate: '2022-12-31',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
