import interactor from '../SaveDailyRecordAndSubmitFixDailyRequestUseCaseInteractor';
import time from '@attendance/__tests__/helpers/time';
import { IInputData } from '@attendance/domain/combinedUseCases/ISaveDailyRecordAndSubmitFixDailyRequestUseCase';

const UseCases = {
  saveDailyRecord: jest.fn(),
  submitFixDailyRequest: jest.fn(),
};

const Presenter = {
  complete: jest.fn(),
};

const UseCase = interactor(UseCases)(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should publish true', async () => {
  // Arrange
  UseCases.saveDailyRecord.mockResolvedValue(true);
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: true,
  });

  // Act
  const result = await UseCase({
    dailyRecord: {
      employeeId: 'employeeId',
      recordId: 'recordId',
      recordDate: 'recordDate',
      startTime: time(7),
      endTime: time(17),
      restTimes: [
        {
          startTime: time(12),
          endTime: time(13),
        },
      ],
      restHours: 0,
      objectivelyEventLog: 'objectivelyEventLog',
      remarks: 'remarks',
    },
    dailyRequestSummary: {
      status: 'status',
    },
  } as unknown as IInputData);

  // Assert
  expect(result).toBe(true);
  expect(UseCases.saveDailyRecord).toBeCalledTimes(1);
  expect(UseCases.saveDailyRecord).toBeCalledWith({
    employeeId: 'employeeId',
    recordId: 'recordId',
    recordDate: 'recordDate',
    startTime: time(7),
    endTime: time(17),
    restTimes: [
      {
        startTime: time(12),
        endTime: time(13),
      },
    ],
    restHours: 0,
    objectivelyEventLog: 'objectivelyEventLog',
    remarks: 'remarks',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases.submitFixDailyRequest).toBeCalledWith({
    id: 'recordId',
    dailyRequestSummary: {
      status: 'status',
    },
  });
});

it('should publish true if employeeId is null', async () => {
  // Arrange
  UseCases.saveDailyRecord.mockResolvedValue(true);
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: true,
  });

  // Act
  const result = await UseCase({
    dailyRecord: {
      recordId: 'recordId',
      recordDate: 'recordDate',
      startTime: time(7),
      endTime: time(17),
      restTimes: [
        {
          startTime: time(12),
          endTime: time(13),
        },
      ],
      restHours: 0,
      objectivelyEventLog: 'objectivelyEventLog',
      remarks: 'remarks',
    },
    dailyRequestSummary: {
      status: 'status',
    },
  } as unknown as IInputData);

  // Assert
  expect(result).toBe(true);
  expect(UseCases.saveDailyRecord).toBeCalledTimes(1);
  expect(UseCases.saveDailyRecord).toBeCalledWith({
    recordId: 'recordId',
    recordDate: 'recordDate',
    startTime: time(7),
    endTime: time(17),
    restTimes: [
      {
        startTime: time(12),
        endTime: time(13),
      },
    ],
    restHours: 0,
    objectivelyEventLog: 'objectivelyEventLog',
    remarks: 'remarks',
  });
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(1);
  expect(UseCases.submitFixDailyRequest).toBeCalledWith({
    id: 'recordId',
    dailyRequestSummary: {
      status: 'status',
    },
  });
});

it('should publish false if saveDailyRecord throws error.', async () => {
  // Arrange
  UseCases.saveDailyRecord.mockImplementation(async () => {
    const error = new Error('TEST');
    error.stack = null;
    throw error;
  });
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: true,
  });

  // Act
  const result = await UseCase({
    dailyRecord: {
      recordId: 'recordId',
    },
    dailyRequestSummary: {
      state: 'state',
    },
  } as unknown as IInputData);

  // Assert
  expect(result).toBe(false);
  expect(UseCases.saveDailyRecord).toBeCalledTimes(1);
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(0);
});

it('should publish false if submitFixDailyRequest throws error.', async () => {
  // Arrange
  UseCases.saveDailyRecord.mockResolvedValue(true);
  UseCases.submitFixDailyRequest.mockResolvedValue({
    result: false,
    reason: 'reason',
  });

  // Act
  const result = await UseCase({
    dailyRecord: {
      recordId: 'recordId',
    },
    dailyRequestSummary: {
      state: 'state',
    },
  } as unknown as IInputData);

  // Assert
  expect(result).toBe(false);
  expect(UseCases.saveDailyRecord).toBeCalledTimes(1);
  expect(UseCases.submitFixDailyRequest).toBeCalledTimes(1);
});
