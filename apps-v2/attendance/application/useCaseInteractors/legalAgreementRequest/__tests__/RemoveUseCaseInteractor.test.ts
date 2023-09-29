import LegalAgreementRequestRepository from '@attendance/application/__tests__/mocks/repositories/LegalAgreementRequestRepository';

import interactor from '../RemoveUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
  confirmRemoving: jest.fn(),
};

const UseCase = interactor({ LegalAgreementRequestRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should not call remove if answer is false', async () => {
  // Arrange
  const input = { requestId: 'id' };
  Presenter.confirmRemoving.mockResolvedValueOnce(false);

  // Act
  const result = await UseCase(input);
  // Assert
  expect(result).toBe(false);
  expect(LegalAgreementRequestRepository.remove).toBeCalledTimes(0);
  expect(Presenter.confirmRemoving).toBeCalledTimes(1);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should call remove if answer is true', async () => {
  // Arrange
  const input = { requestId: 'id' };
  Presenter.confirmRemoving.mockResolvedValueOnce(true);

  // Act
  const result = await UseCase(input);
  // Assert
  expect(result).toBe(true);
  expect(LegalAgreementRequestRepository.remove).toBeCalledTimes(1);
  expect(LegalAgreementRequestRepository.remove).toBeCalledWith(input);
  expect(Presenter.confirmRemoving).toBeCalledTimes(1);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});
