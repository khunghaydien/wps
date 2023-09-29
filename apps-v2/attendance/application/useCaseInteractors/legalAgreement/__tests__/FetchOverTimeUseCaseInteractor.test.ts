import LegalAgreementOvertimeRepository from '@attendance/application/__tests__/mocks/repositories/LegalAgreementOvertimeRepository';

import interactor from '../FetchOvertimeUseCaseInteractor';

const mockFetch =
  LegalAgreementOvertimeRepository.fetch as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ LegalAgreementOvertimeRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call fetchOvertime with employeeId', async () => {
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
    overTime: 'record',
  });
  expect(LegalAgreementOvertimeRepository.fetch).toBeCalledTimes(1);
  expect(LegalAgreementOvertimeRepository.fetch).toBeCalledWith({
    employeeId: 'employeeId',
    targetDate: '2022-02-01',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call fetchOvertime without employeeId', async () => {
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
    overTime: 'record',
  });
  expect(LegalAgreementOvertimeRepository.fetch).toBeCalledTimes(1);
  expect(LegalAgreementOvertimeRepository.fetch).toBeCalledWith({
    targetDate: '2022-02-01',
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
