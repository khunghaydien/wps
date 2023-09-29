import DailyObjectivelyEventLogRepository from '@attendance/application/__tests__/mocks/repositories/DailyObjectivelyEventLogRepository';
import DailyRecordRepository from '@attendance/application/__tests__/mocks/repositories/DailyRecordRepository';

import interactor from '../SaveUseCaseInteractor';

const mockSaveDailyRecord = DailyRecordRepository.save as unknown as jest.Mock;

const mockSaveDailyRecordRemarks =
  DailyRecordRepository.saveRemarks as unknown as jest.Mock;

const mockSaveDeviationReason =
  DailyObjectivelyEventLogRepository.saveDeviationReason as unknown as jest.Mock;

const Presenter = {
  complete: jest.fn(),
  error: jest.fn(),
  confirmToComplementInsufficientingRestTime: jest.fn(),
};

const UseCase = interactor({
  DailyObjectivelyEventLogRepository,
  DailyRecordRepository,
})(Presenter);

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do without calling fillRestTime if response is null', async () => {
  // Arrange
  const input = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  mockSaveDailyRecord.mockImplementationOnce(() => Promise.resolve());

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(input);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(0);
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledTimes(
    0
  );
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should do without calling fillRestTime if insufficientRestTime is 0', async () => {
  // Arrange
  const input = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  mockSaveDailyRecord.mockResolvedValueOnce({
    insufficientRestTime: 0,
  });

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(input);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(0);
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledTimes(
    0
  );
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should do without calling fillRestTime if error is occurred in DailyObjectivelyEventLogRepository.saveDeviationReason', async () => {
  // Arrange
  const input = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: 'remarks',
  };
  const objectivelyEventLog = {
    id: 'objectivelyEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Entering Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Leaving Reason',
    },
  };
  mockSaveDailyRecord.mockResolvedValueOnce({
    insufficientRestTime: 60,
  });
  mockSaveDailyRecordRemarks.mockImplementationOnce(() => Promise.resolve());
  mockSaveDeviationReason.mockRejectedValueOnce('error');

  // Act
  const result = UseCase({ ...input, objectivelyEventLog });

  // Assert
  await expect(result).rejects.toEqual(['error']);
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(input);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.saveDeviationReason).toBeCalledWith(
    objectivelyEventLog
  );
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledTimes(
    0
  );
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should do without calling fillRestTime if answer is no', async () => {
  // Arrange
  const input = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  mockSaveDailyRecord.mockResolvedValueOnce({
    insufficientRestTime: 60,
  });
  Presenter.confirmToComplementInsufficientingRestTime.mockResolvedValueOnce(
    false
  );

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(input);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(0);
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledWith({
    insufficientRestTime: 60,
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should do with calling fillRestTime if answer is yes', async () => {
  // Arrange
  const input = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  mockSaveDailyRecord.mockResolvedValueOnce({
    insufficientRestTime: 60,
  });
  Presenter.confirmToComplementInsufficientingRestTime.mockResolvedValueOnce(
    true
  );

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(input);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(0);
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(1);
  expect(Presenter.confirmToComplementInsufficientingRestTime).toBeCalledWith({
    insufficientRestTime: 60,
  });
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should do with objectivelyEventLog if objectivelyEventLog has other properties', async () => {
  // Arrange
  const record = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  const objectivelyEventLog = {
    id: 'objectivelyEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Entering Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Leaving Reason',
    },
    test: 'test',
  };
  const input = {
    ...record,
    objectivelyEventLog,
  };
  mockSaveDailyRecord.mockImplementationOnce(() => Promise.resolve());
  mockSaveDeviationReason.mockImplementationOnce(() => Promise.resolve());

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(record);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.saveDeviationReason).toBeCalledWith(
    objectivelyEventLog
  );
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should do with objectivelyEventLog', async () => {
  // Arrange
  const record = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  const objectivelyEventLog = {
    id: 'objectivelyEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Entering Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Leaving Reason',
    },
  };
  const input = {
    ...record,
    objectivelyEventLog,
  };
  mockSaveDailyRecord.mockImplementationOnce(() => Promise.resolve());
  mockSaveDeviationReason.mockImplementationOnce(() => Promise.resolve());

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(record);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.saveDeviationReason).toBeCalledWith(
    objectivelyEventLog
  );
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should do without objectivelyEventLog if objectivelyEventLog is null', async () => {
  // Arrange
  const record = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  const objectivelyEventLog = null;
  const input = {
    ...record,
    objectivelyEventLog,
  };
  mockSaveDailyRecord.mockImplementationOnce(() => Promise.resolve());

  // Act
  const result = await UseCase(input);

  // Assert
  expect(result).toBeUndefined();
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(record);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(0);
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should error if error is occurred in DailyRecordRepository.save', async () => {
  // Arrange
  const input = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  mockSaveDailyRecord.mockRejectedValueOnce('error');

  // Act
  const result = UseCase(input);

  // Assert
  await expect(result).rejects.toEqual(['error']);
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(input);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(0);
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should error if error is occurred in DailyObjectivelyEventLogRepository', async () => {
  // Arrange
  const record = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  const objectivelyEventLog = {
    id: 'objectivelyEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Entering Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Leaving Reason',
    },
  };
  const input = {
    ...record,
    objectivelyEventLog,
  };
  mockSaveDailyRecord.mockImplementationOnce(() => Promise.resolve());
  mockSaveDeviationReason.mockRejectedValueOnce('error');

  // Act
  const result = UseCase(input);

  // Assert
  await expect(result).rejects.toEqual(['error']);
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(DailyRecordRepository.save).toBeCalledWith(record);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.saveDeviationReason).toBeCalledWith(
    objectivelyEventLog
  );
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it('should error if error is occurred in all Repository', async () => {
  // Arrange
  const record = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: null,
  };
  const objectivelyEventLog = {
    id: 'objectivelyEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Entering Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Leaving Reason',
    },
  };
  const input = {
    ...record,
    objectivelyEventLog,
  };
  mockSaveDailyRecord.mockRejectedValueOnce('error by DailyRecordRepository');
  mockSaveDeviationReason.mockRejectedValueOnce(
    'error by DailyObjectivelyEventLogRepository'
  );

  // Act
  const result = UseCase(input);

  // Assert
  await expect(result).rejects.toEqual([
    'error by DailyRecordRepository',
    'error by DailyObjectivelyEventLogRepository',
  ]);
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(record);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.saveDeviationReason).toBeCalledWith(
    objectivelyEventLog
  );
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
  expect(Presenter.complete).toBeCalledTimes(0);
  expect(Presenter.error).toBeCalledTimes(0);
});

it.each([null, undefined])(
  'should do without calling saveRemarks if remakes of param is %s',
  async (remarks) => {
    // Arrange
    const input = {
      recordId: 'recordId',
      employeeId: 'employeeId',
      recordDate: '2222-22-22',
      startTime: 60,
      endTime: 120,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
      restTimes: [],
      restHours: 0,
      otherRestReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
      commuteCount: {
        forwardCount: 0,
        backwardCount: 1,
      },
      remarks,
    };
    mockSaveDailyRecord.mockImplementationOnce(() => Promise.resolve());

    // Act
    const result = await UseCase(input);

    // Assert
    expect(result).toBeUndefined();
    expect(DailyRecordRepository.save).toBeCalledTimes(1);
    expect(DailyRecordRepository.save).toBeCalledWith(input);
    expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
    expect(
      DailyObjectivelyEventLogRepository.saveDeviationReason
    ).toBeCalledTimes(0);
    expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
    expect(
      Presenter.confirmToComplementInsufficientingRestTime
    ).toBeCalledTimes(0);
    expect(Presenter.complete).toBeCalledTimes(0);
    expect(Presenter.error).toBeCalledTimes(0);
  }
);

it('should not call DailyRecordRepository.saveRemarks if error is occurred in DailyRecordRepository.save', async () => {
  // Arrange
  const input = {
    recordId: 'recordId',
    employeeId: 'employeeId',
    recordDate: '2222-22-22',
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    restTimes: [],
    restHours: 0,
    otherRestReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
    commuteCount: {
      forwardCount: 0,
      backwardCount: 1,
    },
    remarks: 'remarks',
  };
  const objectivelyEventLog = {
    id: 'objectivelyEventLogId',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Entering Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Leaving Reason',
    },
  };
  mockSaveDailyRecord.mockRejectedValueOnce('error');

  // Act
  const result = UseCase({ ...input, objectivelyEventLog });

  // Assert
  await expect(result).rejects.toEqual(['error']);
  expect(DailyRecordRepository.save).toBeCalledTimes(1);
  expect(DailyRecordRepository.save).toBeCalledWith(input);
  expect(DailyRecordRepository.saveRemarks).toBeCalledTimes(0);
  expect(
    DailyObjectivelyEventLogRepository.saveDeviationReason
  ).toBeCalledTimes(1);
  expect(DailyObjectivelyEventLogRepository.saveDeviationReason).toBeCalledWith(
    objectivelyEventLog
  );
  expect(DailyRecordRepository.fillRestTime).toBeCalledTimes(0);
});
