import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { ObjectivelyEventLog } from '@attendance/domain/models/ObjectivelyEventLog';
import { EVENT_TYPE } from '@attendance/domain/models/ObjectivelyEventLogRecord';

import combineDaily from '../combineDaily';
import { time } from '@attendance/__tests__/helpers';

const setting = {
  id: '',
  name: '',
  code: 'S_CODE_0001',
};

const records: ObjectivelyEventLog[] = [
  {
    id: 'R0001',
    setting,
    eventType: EVENT_TYPE.ENTERING,
    time: time(7, 5),
    linked: 'linked time',
    isApplied: false,
  },
  {
    id: 'R0002',
    setting,
    eventType: EVENT_TYPE.LEAVING,
    time: time(7, 5),
    linked: 'linked time',
    isApplied: false,
  },
];

const createDailyRecord = (
  settingCode: string,
  enteringId: string,
  leavingId: string
): DailyObjectivelyEventLog => ({
  id: 'dailyObjectivelyEventLogId',
  recordId: 'recordId_0001',
  recordDate: '2020-01-01',
  inpStartTime: 6 * 60 + 55,
  inpEndTime: 17 * 60 + 55,
  deviationReasonExtendedItemId: null,
  deviatedEnteringTimeReason: {
    label: null,
    value: null,
    text: 'Deviated Entering Time Reason',
  },
  deviatedLeavingTimeReason: {
    label: null,
    value: null,
    text: 'Deviated Leaving Time Reason',
  },
  logs: [
    {
      setting: {
        id: 'S0001',
        name: 'Setting Name 1',
        code: settingCode,
      },
      entering: {
        id: enteringId,
        eventType: EVENT_TYPE.ENTERING,
        time: 7 * 60 + 5,
        eventLogUpdatedBy: 'Log1 Event Log Updated By',
        deviatedTime: 5,
        linked: '',
      },
      leaving: {
        id: leavingId,
        eventType: EVENT_TYPE.LEAVING,
        time: 16 * 60 + 6,
        eventLogUpdatedBy: '',
        deviatedTime: 6,
        linked: '',
      },
      allowingDeviationTime: null,
      requireDeviationReason: false,
    },
    null,
    null,
  ],
});

describe('isApplied', () => {
  it.each`
    enteringId       | leavingId        | expected
    ${'XXXXX'}       | ${'XXXXX'}       | ${[false, false]}
    ${'XXXXX'}       | ${records[1].id} | ${[false, true]}
    ${records[0].id} | ${'XXXXX'}       | ${[true, false]}
    ${records[0].id} | ${records[1].id} | ${[true, true]}
  `(
    'should $expected if dailyLog is [entering=$enteringId] and [leaving=$leavingId]',
    ({ enteringId, leavingId, expected }) => {
      // Arrange
      const dailyRecord = createDailyRecord(
        setting.code,
        enteringId,
        leavingId
      );

      // Act
      const result = combineDaily(records, dailyRecord);

      // Assert
      expect(result[0].isApplied).toBe(expected[0]);
      expect(result[1].isApplied).toBe(expected[1]);
    }
  );

  it('should do if applied log is exist somewhere in array.', () => {
    // Arrange
    const dailyRecord = createDailyRecord(
      setting.code,
      records[0].id,
      records[1].id
    );
    const appliedLog = dailyRecord.logs[0];

    dailyRecord.logs.forEach((log, idx, logs) => {
      // Arrange
      const $logs = new Array(logs.length).fill(
        null
      ) as DailyObjectivelyEventLog['logs'];
      $logs[idx] = appliedLog;

      // Act
      const result = combineDaily(records, {
        ...dailyRecord,
        logs: $logs,
      });

      // Assert
      expect(result[0].isApplied).toBe(true);
      expect(result[1].isApplied).toBe(true);
    });
  });
});

it('should do combineDaily returns sorted list by setting and time', () => {
  // Create additional setting
  const setting2 = {
    id: '',
    name: '',
    code: 'S_CODE_0002',
  };
  // Create added records
  const addedRecords: ObjectivelyEventLog[] = [
    ...records,
    {
      id: 'R0000',
      setting,
      eventType: EVENT_TYPE.ENTERING,
      time: time(7, 1),
      linked: 'linked time',
      isApplied: false,
    },
    {
      id: 'R0003',
      setting,
      eventType: EVENT_TYPE.LEAVING,
      time: time(16, 5),
      linked: 'linked time',
      isApplied: false,
    },
    {
      id: 'R0004',
      setting: setting2,
      eventType: EVENT_TYPE.LEAVING,
      time: time(7, 0),
      linked: 'linked time',
      isApplied: false,
    },
  ];

  // Arrange
  const dailyRecord: DailyObjectivelyEventLog = {
    id: 'dailyObjectivelyEventLogId',
    recordId: 'recordId_0001',
    recordDate: '2020-01-01',
    inpStartTime: 6 * 60 + 55,
    inpEndTime: 17 * 60 + 55,
    deviationReasonExtendedItemId: null,
    deviatedEnteringTimeReason: {
      label: null,
      value: null,
      text: 'Deviated Entering Time Reason',
    },
    deviatedLeavingTimeReason: {
      label: null,
      value: null,
      text: 'Deviated Leaving Time Reason',
    },
    logs: [
      {
        setting,
        entering: {
          id: addedRecords[0].id,
          eventType: EVENT_TYPE.ENTERING,
          time: 7 * 60 + 5,
          eventLogUpdatedBy: 'Log1 Event Log Updated By',
          deviatedTime: 5,
          linked: '',
        },
        leaving: {
          id: addedRecords[1].id,
          eventType: EVENT_TYPE.LEAVING,
          time: 16 * 60 + 6,
          eventLogUpdatedBy: '',
          deviatedTime: 6,
          linked: '',
        },
        allowingDeviationTime: null,
        requireDeviationReason: false,
      },
      {
        setting: setting2,
        entering: {
          id: addedRecords[4].id,
          eventType: EVENT_TYPE.ENTERING,
          time: 7 * 60 + 5,
          eventLogUpdatedBy: 'Log1 Event Log Updated By',
          deviatedTime: 5,
          linked: '',
        },
        leaving: {
          id: null,
          eventType: null,
          time: null,
          eventLogUpdatedBy: null,
          deviatedTime: null,
          linked: null,
        },
        allowingDeviationTime: null,
        requireDeviationReason: false,
      },
      null,
    ],
  };

  // Act
  const result = combineDaily(addedRecords, dailyRecord);

  expect(result[0].id).toBe('R0000');
  expect(result[1].id).toBe('R0001');
  expect(result[2].id).toBe('R0002');
  expect(result[3].id).toBe('R0003');
  expect(result[4].id).toBe('R0004');
});

it('should do if setting is found.', () => {
  // Arrange
  const dailyRecord = createDailyRecord(
    setting.code,
    records[0].id,
    records[1].id
  );

  // Act
  const result = combineDaily(records, dailyRecord);

  // Assert
  expect(result[0].setting).toEqual(dailyRecord.logs[0].setting);
  expect(result[1].setting).toEqual(dailyRecord.logs[0].setting);
  expect(result[0].setting).not.toEqual(records[0].setting);
  expect(result[1].setting).not.toEqual(records[1].setting);
});

it('should do if setting is not found.', () => {
  // Arrange
  const dailyRecord = createDailyRecord('XXXXX', records[0].id, records[1].id);

  // Act
  const result = combineDaily(records, dailyRecord);

  // Assert
  expect(result[0].isApplied).toBe(true);
  expect(result[1].isApplied).toBe(true);
  expect(result[0].setting).not.toEqual(dailyRecord.logs[0].setting);
  expect(result[1].setting).not.toEqual(dailyRecord.logs[0].setting);
  expect(result[0].setting).toEqual(records[0].setting);
});

it('should do if logs are empty.', () => {
  // Arrange
  const $dailyRecord = createDailyRecord(
    setting.code,
    records[0].id,
    records[1].id
  );
  const dailyRecord: DailyObjectivelyEventLog = {
    ...$dailyRecord,
    logs: [null, null, null],
  };

  // Act
  const result = combineDaily(records, dailyRecord);

  // Assert
  expect(result).toEqual(records);
});
