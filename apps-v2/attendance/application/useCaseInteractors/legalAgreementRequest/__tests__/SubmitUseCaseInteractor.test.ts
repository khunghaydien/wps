import LegalAgreementRequestRepository from '@attendance/application/__tests__/mocks/repositories/LegalAgreementRequestRepository';

import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import interactor from '../SubmitUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
};

const UseCase = interactor({ LegalAgreementRequestRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call create', async () => {
  // Arrange
  const input = {
    requestId: 'ahueu348',
    summaryId: 'nue48ur8394',
    requestType: CODE.MONTHLY,
    changedOvertimeHoursLimit: 0,
    reason: 'reason',
    measures: 'measures',
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(LegalAgreementRequestRepository.submit).toBeCalledTimes(1);
  expect(LegalAgreementRequestRepository.submit).toBeCalledWith(input);
});
