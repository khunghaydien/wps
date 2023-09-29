import LegalAgreementRequestRepository from '@attendance/application/__tests__/mocks/repositories/LegalAgreementRequestRepository';

import interactor from '../CancelApprovalUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ LegalAgreementRequestRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call cancel approval', async () => {
  // Arrange
  const input = { requestId: 'id' };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(LegalAgreementRequestRepository.cancelApproval).toBeCalledTimes(1);
  expect(LegalAgreementRequestRepository.cancelApproval).toBeCalledWith(input);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
