import LegalAgreementRequestRepository from '@attendance/application/__tests__/mocks/repositories/LegalAgreementRequestRepository';

import interactor from '../CancelRequestUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ LegalAgreementRequestRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call cancel request', async () => {
  // Arrange
  const input = { requestId: 'id' };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(LegalAgreementRequestRepository.cancelRequest).toBeCalledTimes(1);
  expect(LegalAgreementRequestRepository.cancelRequest).toBeCalledWith(input);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
