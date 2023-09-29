import snapshotDiff from 'snapshot-diff';

import DailyRecordFactory from '../DailyRecordFactory';

describe('create', () => {
  // Arrange
  const input = {
    employeeId: 'employeeId',
    recordId: 'recordId',
    recordDate: 'recordDate',
    startTime: 1,
    endTime: 2,
    restTimes: [
      {
        startTime: 3,
        endTime: 4,
        restReason: {
          id: 'restReasonId',
          code: 'restReasonCode',
          name: 'restReasonName',
        },
      },
    ],
    restHours: 10,
    otherRestReason: {
      id: 'otherRestReasonId',
      code: 'otherRestReasonCode',
      name: 'otherRestReasonName',
    },
    remarks: 'remarks',
    hasRestTime: true,
    dailyObjectivelyEventLog: {
      id: 'dailyObjectivelyEventLogId',
      recordId: 'recordId',
      recordDate: 'recordDate',
      inpStartTime: 21,
      inpEndTime: 22,
      deviatedEnteringTimeReason: {
        value: null,
        text: 'deviatedEnteringTimeReason',
      },
      deviatedLeavingTimeReason: {
        value: null,
        text: 'deviatedLeavingTimeReason',
      },
      logs: [null, null, null],
    },
  } as Parameters<typeof DailyRecordFactory['create']>[0];
  it('should execute', () => {
    // Act
    const result = DailyRecordFactory.create(input);

    // Assert
    expect(snapshotDiff(input, result)).toMatchSnapshot();
  });
  it.each([undefined, null, ''])('should convert remarks', (remarks) => {
    // Arrange
    const $input = {
      ...input,
      remarks,
    };

    // Act
    const result = DailyRecordFactory.create($input);

    // Assert
    expect(result.remarks).toBe('');
  });
  it.each([undefined, null])(
    'should convert dailyObjectivelyEventLog',
    (dailyObjectivelyEventLog) => {
      // Arrange
      const $input = {
        ...input,
        dailyObjectivelyEventLog,
      };

      // Act
      const result = DailyRecordFactory.create($input);

      // Assert
      expect(result.objectivelyEventLog).toBe(null);
    }
  );
});
