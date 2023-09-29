import { EVENT_TYPE } from '@attendance/domain/models/ObjectivelyEventLogRecord';

import {
  // @ts-ignore
  __get__,
} from '../DailyObjectivelyEventLogDialogContainer';

describe('createParameterForSetToBeApplied', () => {
  const createParameterForSetToBeApplied = __get__(
    'createParameterForSetToBeApplied'
  );
  it('should convert', async () => {
    // Arrange
    const records = [...Array(2 * 3).keys()].map((idx) => ({
      id: `RECORD_ID_${idx + 1}`,
      eventType: idx % 2 === 0 ? EVENT_TYPE.ENTERING : EVENT_TYPE.LEAVING,
      isApplied: true,
      setting: {
        id: `SETTING_ID_${Math.floor(idx / 2) + 1}`,
      },
    }));
    const dailyRecord = {
      id: 'DAILY_RECORD_ID',
      logs: [
        {
          setting: { id: 'SETTING_ID_1' },
        },
        {
          setting: { id: 'SETTING_ID_2' },
        },
        {
          setting: { id: 'SETTING_ID_3' },
        },
      ],
    };

    // Act
    const result = createParameterForSetToBeApplied(records, dailyRecord);

    // Assert
    expect(result).toEqual({
      id: 'DAILY_RECORD_ID',
      records: [
        {
          enteringId: 'RECORD_ID_1',
          leavingId: 'RECORD_ID_2',
        },
        {
          enteringId: 'RECORD_ID_3',
          leavingId: 'RECORD_ID_4',
        },
        {
          enteringId: 'RECORD_ID_5',
          leavingId: 'RECORD_ID_6',
        },
      ],
    });
  });
  it('should filter by isApplied', async () => {
    // Arrange
    const records = [...Array(2 * 3).keys()].map((idx) => ({
      id: `RECORD_ID_${idx + 1}`,
      eventType: idx % 2 === 0 ? EVENT_TYPE.ENTERING : EVENT_TYPE.LEAVING,
      isApplied: false,
      setting: {
        id: `SETTING_ID_${Math.floor(idx / 2) + 1}`,
      },
    }));
    const dailyRecord = {
      id: 'DAILY_RECORD_ID',
      logs: [
        {
          setting: { id: 'SETTING_ID_1' },
        },
        {
          setting: { id: 'SETTING_ID_2' },
        },
        {
          setting: { id: 'SETTING_ID_2' },
        },
      ],
    };

    // Act
    const result = createParameterForSetToBeApplied(records, dailyRecord);

    // Assert
    expect(result).toEqual({
      id: 'DAILY_RECORD_ID',
      records: [
        {
          enteringId: null,
          leavingId: null,
        },
        {
          enteringId: null,
          leavingId: null,
        },
        {
          enteringId: null,
          leavingId: null,
        },
      ],
    });
  });
  it('should return null if log is null', async () => {
    // Arrange
    const records = [...Array(2 * 3).keys()].map((idx) => ({
      id: `RECORD_ID_${idx + 1}`,
      eventType: idx % 2 === 0 ? EVENT_TYPE.ENTERING : EVENT_TYPE.LEAVING,
      isApplied: true,
      setting: {
        id: `SETTING_ID_${Math.floor(idx / 2) + 1}`,
      },
    }));
    const dailyRecord = {
      id: 'DAILY_RECORD_ID',
      logs: [null, null, null],
    };

    // Act
    const result = createParameterForSetToBeApplied(records, dailyRecord);

    // Assert
    expect(result).toEqual({
      id: 'DAILY_RECORD_ID',
      records: [
        {
          enteringId: null,
          leavingId: null,
        },
        {
          enteringId: null,
          leavingId: null,
        },
        {
          enteringId: null,
          leavingId: null,
        },
      ],
    });
  });
  it('should return null if record is not found', async () => {
    // Arrange
    const records = [];
    const dailyRecord = {
      id: 'DAILY_RECORD_ID',
      logs: [
        {
          setting: { id: 'SETTING_ID_1' },
        },
        {
          setting: { id: 'SETTING_ID_2' },
        },
        {
          setting: { id: 'SETTING_ID_2' },
        },
      ],
    };

    // Act
    const result = createParameterForSetToBeApplied(records, dailyRecord);

    // Assert
    expect(result).toEqual({
      id: 'DAILY_RECORD_ID',
      records: [
        {
          enteringId: null,
          leavingId: null,
        },
        {
          enteringId: null,
          leavingId: null,
        },
        {
          enteringId: null,
          leavingId: null,
        },
      ],
    });
  });
});
