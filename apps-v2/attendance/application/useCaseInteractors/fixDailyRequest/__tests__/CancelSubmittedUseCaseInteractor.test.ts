import FixDailyRequestRepository from '@attendance/application/__tests__/mocks/repositories/FixDailyRequestRepository';

import { REASON } from '@attendance/domain/models/Result';

import interactor from '../CancelSubmittedUseCaseInteractor';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do.', async () => {
  // Arrange
  const Presenter = {
    complete: jest.fn(),
  };
  const UseCase = interactor({ FixDailyRequestRepository })(Presenter);
  const input = 'requestId';

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
    value: undefined,
  });
  expect(FixDailyRequestRepository.cancelSubmitted).toBeCalledTimes(1);
  expect(FixDailyRequestRepository.cancelSubmitted).toBeCalledWith('requestId');
});

it("should execute if user's answer is true .", async () => {
  // Arrange
  const Presenter = {
    complete: jest.fn(),
    confirm: jest.fn(),
  };
  const UseCase = interactor({ FixDailyRequestRepository })(Presenter);
  const input = 'requestId';
  Presenter.confirm.mockResolvedValue(true);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
    value: undefined,
  });
  expect(FixDailyRequestRepository.cancelSubmitted).toBeCalledTimes(1);
  expect(FixDailyRequestRepository.cancelSubmitted).toBeCalledWith('requestId');
});

it("should not execute if user's answer is false .", async () => {
  // Arrange
  const Presenter = {
    complete: jest.fn(),
    confirm: jest.fn(),
  };
  const UseCase = interactor({ FixDailyRequestRepository })(Presenter);
  const input = 'requestId';
  Presenter.confirm.mockResolvedValue(false);

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: false,
    reason: REASON.USER_INDUCED,
  });
  expect(FixDailyRequestRepository.cancelSubmitted).toBeCalledTimes(0);
});
