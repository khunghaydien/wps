import LegalAgreementRequestRepository from '@attendance/application/__tests__/mocks/repositories/LegalAgreementRequestRepository';

import interactor from '../FetchListUseCaseInteractor';

const mockFetch =
  LegalAgreementRequestRepository.fetchList as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ LegalAgreementRequestRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call fetchList with employeeId', async () => {
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
    requestList: 'record',
  });
  expect(LegalAgreementRequestRepository.fetchList).toBeCalledTimes(1);
  expect(LegalAgreementRequestRepository.fetchList).toBeCalledWith({
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call fetchList without employeeId', async () => {
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
    requestList: 'record',
  });
  expect(LegalAgreementRequestRepository.fetchList).toBeCalledTimes(1);
  expect(LegalAgreementRequestRepository.fetchList).toBeCalledWith({
    targetDate: '2022-02-01',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
