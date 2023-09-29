import LegalAgreementRequestRepository from '@attendance/application/__tests__/mocks/repositories/LegalAgreementRequestRepository';

import interactor from '../ReapplyUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ LegalAgreementRequestRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call reapply', async () => {
  // Arrange
  const input = {
    originalRequestId: 'ahuvd548',
    requestId: 'ahueu348',
    changedOvertimeHoursLimit: 0,
    reason: 'reason',
    measures: 'measures',
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(LegalAgreementRequestRepository.reapply).toBeCalledTimes(1);
  expect(LegalAgreementRequestRepository.reapply).toBeCalledWith(input);
});
