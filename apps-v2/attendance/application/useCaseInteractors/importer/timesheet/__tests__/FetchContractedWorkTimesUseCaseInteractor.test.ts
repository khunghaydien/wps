import ContractedWorkTimeRepository from '@attendance/application/__tests__/mocks/repositories/importer/ContractedWorkTimeRepository';

import interactor from '../FetchContractedWorkTimesUseCaseInteractor';

const mockFetch = ContractedWorkTimeRepository.fetch as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({
  ContractedWorkTimeRepository,
})(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should execute. ', async () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    startDate: 'startDate',
    endDate: 'endDate',
  };
  mockFetch.mockResolvedValueOnce('record');

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual('record');
  expect(ContractedWorkTimeRepository.fetch).toHaveBeenCalledTimes(1);
  expect(ContractedWorkTimeRepository.fetch).toHaveBeenCalledWith(input);
});
