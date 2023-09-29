import FixDailyRequestRepository from '@attendance/application/__tests__/mocks/repositories/FixDailyRequestRepository';

import { STATUS as DAILY_REQUEST_STATUS } from '@attendance/domain/models/AttDailyRequest';
import { REASON } from '@attendance/domain/models/Result';

import interactor from '../SubmitUseCaseInteractor';

const Presenter = {
  complete: jest.fn(),
  confirmToSubmitWithWarning: jest.fn(),
};

const UseCase = interactor({ FixDailyRequestRepository })(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do.', async () => {
  // Arrange
  const input = {
    id: 'recordId',
    dailyRequestSummary: {
      status: DAILY_REQUEST_STATUS.NOT_REQUESTED,
    },
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
  });
  expect(FixDailyRequestRepository.canSubmit).toBeCalledTimes(1);
  expect(FixDailyRequestRepository.canSubmit).toBeCalledWith('recordId');
  expect(FixDailyRequestRepository.submit).toBeCalledTimes(1);
  expect(FixDailyRequestRepository.submit).toBeCalledWith('recordId');
  expect(Presenter.confirmToSubmitWithWarning).toBeCalledTimes(0);
});

it('should do with waring.', async () => {
  // Arrange
  (FixDailyRequestRepository.canSubmit as jest.Mock).mockResolvedValueOnce({
    confirmation: ['waring'],
  });
  Presenter.confirmToSubmitWithWarning.mockResolvedValueOnce(true);

  const input = {
    id: 'recordId',
    dailyRequestSummary: {
      status: DAILY_REQUEST_STATUS.NOT_REQUESTED,
    },
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: true,
  });
  expect(FixDailyRequestRepository.canSubmit).toBeCalledTimes(1);
  expect(FixDailyRequestRepository.canSubmit).toBeCalledWith('recordId');
  expect(FixDailyRequestRepository.submit).toBeCalledTimes(1);
  expect(FixDailyRequestRepository.submit).toBeCalledWith('recordId');
  expect(Presenter.confirmToSubmitWithWarning).toBeCalledTimes(1);
  expect(Presenter.confirmToSubmitWithWarning).toBeCalledWith(['waring']);
});

it('should not do with waring if answer is no.', async () => {
  // Arrange
  (FixDailyRequestRepository.canSubmit as jest.Mock).mockResolvedValueOnce({
    confirmation: ['waring'],
  });
  Presenter.confirmToSubmitWithWarning.mockResolvedValueOnce(false);

  const input = {
    id: 'recordId',
    dailyRequestSummary: {
      status: DAILY_REQUEST_STATUS.NOT_REQUESTED,
    },
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: false,
    reason: REASON.USER_INDUCED,
  });
  expect(FixDailyRequestRepository.canSubmit).toBeCalledTimes(1);
  expect(FixDailyRequestRepository.canSubmit).toBeCalledWith('recordId');
  expect(Presenter.confirmToSubmitWithWarning).toBeCalledTimes(1);
  expect(Presenter.confirmToSubmitWithWarning).toBeCalledWith(['waring']);
  expect(FixDailyRequestRepository.submit).toBeCalledTimes(0);
});

it('should not do if request is submitting.', async () => {
  // Arrange
  (FixDailyRequestRepository.canSubmit as jest.Mock).mockResolvedValueOnce({
    confirmation: ['waring'],
  });
  Presenter.confirmToSubmitWithWarning.mockResolvedValueOnce(false);

  const input = {
    id: 'recordId',
    dailyRequestSummary: {
      status: DAILY_REQUEST_STATUS.APPROVAL_IN,
    },
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: false,
    reason: REASON.EXISTED_SUBMITTING_REQUEST,
  });
  expect(FixDailyRequestRepository.canSubmit).toBeCalledTimes(0);
  expect(Presenter.confirmToSubmitWithWarning).toBeCalledTimes(0);
  expect(FixDailyRequestRepository.submit).toBeCalledTimes(0);
});

it('should not do if request is rejected.', async () => {
  // Arrange
  (FixDailyRequestRepository.canSubmit as jest.Mock).mockResolvedValueOnce({
    confirmation: ['waring'],
  });
  Presenter.confirmToSubmitWithWarning.mockResolvedValueOnce(false);

  const input = {
    id: 'recordId',
    dailyRequestSummary: {
      status: DAILY_REQUEST_STATUS.REJECTED,
    },
  };

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toEqual({
    result: false,
    reason: REASON.EXISTED_INVALID_REQUEST,
  });
  expect(FixDailyRequestRepository.canSubmit).toBeCalledTimes(0);
  expect(Presenter.confirmToSubmitWithWarning).toBeCalledTimes(0);
  expect(FixDailyRequestRepository.submit).toBeCalledTimes(0);
});
