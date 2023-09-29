import * as ObjectivelyEventLog from '../ObjectivelyEventLog';
import { EVENT_TYPE } from '../ObjectivelyEventLogRecord';

describe('apply()', () => {
  it('should be off other record if records have some settingId and eventType', () => {
    // Arrange
    const records = [null, null, null].map(() => ({
      id: '',
      eventType: EVENT_TYPE.ENTERING,
      setting: {
        id: 'S0001',
      },
      isApplied: false,
    })) as unknown as ObjectivelyEventLog.ObjectivelyEventLog[];
    records[0].id = 'R0001';
    records[0].isApplied = true;
    records[1].id = 'R0002';
    records[2].id = 'R0003';

    // Act
    const result = ObjectivelyEventLog.apply(records, 'R0003');

    // Assert
    expect(result[0].isApplied).toBe(false);
    expect(result[1].isApplied).toBe(false);
    expect(result[2].isApplied).toBe(true);
  });

  it('should not change other records if records have some settingId but different eventType', () => {
    // Arrange
    const records = [null, null, null].map(() => ({
      id: '',
      eventType: EVENT_TYPE.ENTERING,
      setting: {
        id: 'S0001',
      },
      isApplied: false,
    })) as unknown as ObjectivelyEventLog.ObjectivelyEventLog[];
    records[0].id = 'R0001';
    records[0].isApplied = true;
    records[1].id = 'R0002';
    records[2].id = 'R0003';
    records[2].eventType = EVENT_TYPE.LEAVING;

    // Act
    const result = ObjectivelyEventLog.apply(records, 'R0003');

    // Assert
    expect(result[0].isApplied).toBe(true);
    expect(result[1].isApplied).toBe(false);
    expect(result[2].isApplied).toBe(true);
  });

  it('should not change other record if records have same eventType but different settingId', () => {
    // Arrange
    const records = [null, null, null].map(() => ({
      id: '',
      eventType: EVENT_TYPE.ENTERING,
      setting: {
        id: 'S0001',
      },
      isApplied: false,
    })) as unknown as ObjectivelyEventLog.ObjectivelyEventLog[];
    records[0].id = 'R0001';
    records[0].isApplied = true;
    records[1].id = 'R0002';
    records[2].id = 'R0003';
    records[2].setting.id = 'S0002';

    // Act
    const result = ObjectivelyEventLog.apply(records, 'R0003');

    // Assert
    expect(result[0].isApplied).toBe(true);
    expect(result[1].isApplied).toBe(false);
    expect(result[2].isApplied).toBe(true);
  });

  it('should not change if id is not found', () => {
    // Arrange
    const records = [null, null, null].map(() => ({
      id: '',
      eventType: EVENT_TYPE.ENTERING,
      setting: {
        id: 'S0001',
      },
      isApplied: false,
    })) as unknown as ObjectivelyEventLog.ObjectivelyEventLog[];
    records[0].id = 'R0001';
    records[1].id = 'R0002';
    records[2].id = 'R0003';

    // Act
    const result = ObjectivelyEventLog.apply(records, 'R0004');

    // Assert
    expect(result).toEqual(records);
  });
});
