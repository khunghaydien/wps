import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import {
  CLOCK_TYPE,
  STAMP_SOURCE,
} from '@attendance/domain/models/DailyStampTime';
import { REASON } from '@attendance/domain/models/Result';

import interactor from '../SubmitFixDailyRequestWithClockOutUseCaseInteractor';

const UseCases = {
  stampTime: jest.fn(),
  submitFixDailyRequest: jest.fn(),
};

const Presenter = {
  complete: jest.fn(),
  confirmToSubmitWithWarning: jest.fn(),
};

const UseCase = interactor(UseCases)(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do with submitting', async () => {
  // Arrange
  UseCases.stampTime.mockResolvedValue({
    result: true,
    value: {
      targetDate: '2022-02-22',
    },
  });
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: true,
    value: undefined,
  });

  // Act
  const result = await UseCase({
    stampTimeRecord: {
      comment: 'comment',
      source: STAMP_SOURCE.WEB,
    },
    dailyRecords: {
      '2022-02-22': {
        id: 'test',
        dailyRequestSummary: {
          status: STATUS.NOT_REQUESTED,
        },
      },
    },
  });

  // Assert
  expect(UseCases.stampTime).toBeCalledTimes(1);
  expect(UseCases.stampTime).toBeCalledWith({
    clockType: CLOCK_TYPE.OUT,
    source: STAMP_SOURCE.WEB,
    comment: 'comment',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases.submitFixDailyRequest).toBeCalledWith({
    id: 'test',
    dailyRequestSummary: {
      status: STATUS.NOT_REQUESTED,
    },
  });
  expect(result).toEqual({
    result: true,
    value: undefined,
  });
});

it('should not do with submitting if posting result is false', async () => {
  // Arrange
  UseCases.stampTime.mockResolvedValue({
    result: false,
    reason: REASON.USER_INDUCED,
  });
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: true,
    value: undefined,
  });

  // Act
  const result = await UseCase({
    stampTimeRecord: {
      comment: 'comment',
      source: STAMP_SOURCE.WEB,
    },
    dailyRecords: {
      '2022-02-22': {
        id: 'test',
        dailyRequestSummary: {
          status: STATUS.NOT_REQUESTED,
        },
      },
    },
  });

  // Assert
  expect(UseCases.stampTime).toBeCalledTimes(1);
  expect(UseCases.stampTime).toBeCalledWith({
    clockType: CLOCK_TYPE.OUT,
    source: STAMP_SOURCE.WEB,
    comment: 'comment',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(0);
  expect(result).toEqual({
    result: false,
    reason: REASON.UNEXPECTED,
  });
});

it('should return false if submitting result is false', async () => {
  // Arrange
  UseCases.stampTime.mockResolvedValue({
    result: true,
    value: {
      targetDate: '2022-02-22',
    },
  });
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: false,
    reason: REASON.USER_INDUCED,
  });

  // Act
  const result = await UseCase({
    stampTimeRecord: {
      comment: 'comment',
      source: STAMP_SOURCE.WEB,
    },
    dailyRecords: {
      '2022-02-22': {
        id: 'test',
        dailyRequestSummary: {
          status: STATUS.NOT_REQUESTED,
        },
      },
    },
  });

  // Assert
  expect(UseCases.stampTime).toBeCalledTimes(1);
  expect(UseCases.stampTime).toBeCalledWith({
    clockType: CLOCK_TYPE.OUT,
    source: STAMP_SOURCE.WEB,
    comment: 'comment',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases.submitFixDailyRequest).toBeCalledWith({
    id: 'test',
    dailyRequestSummary: {
      status: STATUS.NOT_REQUESTED,
    },
  });
  expect(result).toEqual({
    result: false,
    reason: REASON.UNEXPECTED,
  });
});

it('should do without submitting if record is not found.', async () => {
  // Arrange
  UseCases.stampTime.mockResolvedValue({
    result: true,
    value: {
      targetDate: '2022-02-23',
    },
  });
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: true,
    value: undefined,
  });

  // Act
  const result = await UseCase({
    stampTimeRecord: {
      comment: 'comment',
      source: STAMP_SOURCE.WEB,
    },
    dailyRecords: {
      '2022-02-22': {
        id: 'test',
        dailyRequestSummary: {
          status: STATUS.NOT_REQUESTED,
        },
      },
    },
  });

  // Assert
  expect(UseCases.stampTime).toBeCalledTimes(1);
  expect(UseCases.stampTime).toBeCalledWith({
    clockType: CLOCK_TYPE.OUT,
    source: STAMP_SOURCE.WEB,
    comment: 'comment',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(0);
  expect(result).toEqual({ result: true });
});

it('should do without submitting if targetDate is null', async () => {
  // Arrange
  UseCases.stampTime.mockResolvedValue({
    result: true,
    value: {
      targetDate: null,
    },
  });
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: true,
    value: undefined,
  });

  // Act
  const result = await UseCase({
    stampTimeRecord: {
      comment: 'comment',
      source: STAMP_SOURCE.WEB,
    },
    dailyRecords: {
      '2022-02-22': {
        id: 'test',
        dailyRequestSummary: {
          status: STATUS.NOT_REQUESTED,
        },
      },
    },
  });

  // Assert
  expect(UseCases.stampTime).toBeCalledTimes(1);
  expect(UseCases.stampTime).toBeCalledWith({
    clockType: CLOCK_TYPE.OUT,
    source: STAMP_SOURCE.WEB,
    comment: 'comment',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(0);
  expect(result).toEqual({ result: true });
});

it('should error if stampTime() is failed.', async () => {
  // Arrange
  UseCases.stampTime.mockRejectedValue('');

  // Act
  const result = await UseCase({
    stampTimeRecord: {
      comment: 'comment',
      source: STAMP_SOURCE.WEB,
    },
    dailyRecords: {
      '2022-02-22': {
        id: 'test',
        dailyRequestSummary: {
          status: STATUS.NOT_REQUESTED,
        },
      },
    },
  });

  // Assert
  expect(UseCases.stampTime).toBeCalledTimes(1);
  expect(UseCases.stampTime).toBeCalledWith({
    clockType: CLOCK_TYPE.OUT,
    source: STAMP_SOURCE.WEB,
    comment: 'comment',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(0);
  expect(result).toEqual({ result: false, reason: REASON.UNEXPECTED });
});

it('should error if submit() is failed.', async () => {
  // Arrange
  UseCases.stampTime.mockResolvedValue({
    result: true,
    value: {
      targetDate: '2022-02-22',
    },
  });
  UseCases.submitFixDailyRequest.mockRejectedValue(false);

  // Act
  const result = await UseCase({
    stampTimeRecord: {
      comment: 'comment',
      source: STAMP_SOURCE.WEB,
    },
    dailyRecords: {
      '2022-02-22': {
        id: 'test',
        dailyRequestSummary: {
          status: STATUS.NOT_REQUESTED,
        },
      },
    },
  });

  // Assert
  expect(UseCases.stampTime).toBeCalledTimes(1);
  expect(UseCases.stampTime).toBeCalledWith({
    clockType: CLOCK_TYPE.OUT,
    source: STAMP_SOURCE.WEB,
    comment: 'comment',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases.submitFixDailyRequest).toBeCalledWith({
    id: 'test',
    dailyRequestSummary: {
      status: STATUS.NOT_REQUESTED,
    },
  });
  expect(result).toEqual({ result: false, reason: REASON.UNEXPECTED });
});
