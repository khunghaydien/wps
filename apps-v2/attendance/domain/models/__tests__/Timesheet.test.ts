import {
  getAttDailyRecordByDate,
  getAttDailyRequestByAttDailyRecord,
  getAttDailyRequestByRecordDate,
  getPeriod,
  getPeriodFromArray,
  isTargetDateInTimesheet,
} from '../Timesheet';
import { mockTimesheet } from './mocks/timesheet';

describe('@attendance/domain/models/Timesheet', () => {
  describe('getAttDailyRecordByDate', () => {
    it('should get a record of the specified date', () => {
      // Arrange
      const expectRecord = mockTimesheet.recordsByRecordDate['2020-02-04'];
      // Act
      // @ts-ignore
      const actual = getAttDailyRecordByDate('2020-02-04', mockTimesheet);
      // Assert
      expect(actual).toBe(expectRecord);
    });
    it('should get a null if targetDate is invalid,', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = getAttDailyRecordByDate('', mockTimesheet);
      // Assert
      expect(actual).toBeNull();
    });
  });
  describe('getAttDailyRequestByAttDailyRecord', () => {
    it('should get the request record for the same day as the specified request', () => {
      // Arrange
      const expectRecords = [
        mockTimesheet.requestsById.a012v000033Tas8AAC,
        mockTimesheet.requestsById.a012v000033TasDAAS,
        mockTimesheet.requestsById.a012v000033TasSAAS,
      ];
      // Act
      const actual = getAttDailyRequestByAttDailyRecord(
        // @ts-ignore
        mockTimesheet.recordsByRecordDate['2020-02-05'],
        mockTimesheet
      );
      // Assert
      expect(actual).toMatchObject(expectRecords);
    });
    it('should get a empty array if an attDailyRecord is null', () => {
      // Arrange
      const expectRecords = [];
      // Act
      // @ts-ignore
      const actual = getAttDailyRequestByAttDailyRecord(null, mockTimesheet);
      // Assert
      expect(actual).toMatchObject(expectRecords);
    });
  });
  describe('getAttDailyRequestByRecordDate', () => {
    it('should get the request record for the same day as the specified date', () => {
      // Arrange
      const expectRecords = [
        mockTimesheet.requestsById.a012v000033Tas8AAC,
        mockTimesheet.requestsById.a012v000033TasDAAS,
        mockTimesheet.requestsById.a012v000033TasSAAS,
      ];
      // Act
      const actual = getAttDailyRequestByRecordDate(
        '2020-02-05',
        // @ts-ignore
        mockTimesheet
      );
      // Assert
      expect(actual).toMatchObject(expectRecords);
    });
    it('should get a empty array if recordDate is invalid', () => {
      // Arrange
      const expectRecords = [];
      // Act
      // @ts-ignore
      const actual = getAttDailyRequestByRecordDate('', mockTimesheet);
      // Assert
      expect(actual).toMatchObject(expectRecords);
    });
  });
  describe('getPeriod', () => {
    it('should get the monthly period of the specified date', () => {
      // Arrange
      const expectRecords = {
        startDate: '2020-02-01',
        name: '2020年02月',
        endDate: '2020-02-29',
      };
      // Act
      // @ts-ignore
      const actual = getPeriod('2020-02-01', mockTimesheet);
      // Assert
      expect(actual).toMatchObject(expectRecords);
    });
    it('should get a null if targetDate is invalid', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = getPeriod('', mockTimesheet);
      // Assert
      expect(actual).toBeNull();
    });
    it('should get a null if targetDate is over the range', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = getPeriod('2020-05-01', mockTimesheet);
      // Assert
      expect(actual).toBeNull();
    });
    it('should get a null if targetDate is below the range', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = getPeriod('2019-01-01', mockTimesheet);
      // Assert
      expect(actual).toBeNull();
    });
  });
  describe('getPeriodFromArray', () => {
    it('should get the monthly period of the specified date', () => {
      // Arrange
      const expectRecords = {
        startDate: '2020-02-01',
        name: '2020年02月',
        endDate: '2020-02-29',
      };
      // Act
      const actual = getPeriodFromArray('2020-02-01', mockTimesheet.periods);
      // Assert
      expect(actual).toMatchObject(expectRecords);
    });
    it('should get a null if targetDate is invalid', () => {
      // Arrange
      // Act
      const actual = getPeriodFromArray('', mockTimesheet.periods);
      // Assert
      expect(actual).toBeNull();
    });
    it('should get a null if targetDate is over the range', () => {
      // Arrange
      // Act
      const actual = getPeriodFromArray('2020-05-01', mockTimesheet.periods);
      // Assert
      expect(actual).toBeNull();
    });
    it('should get a null if targetDate is below the range', () => {
      // Arrange
      // Act
      const actual = getPeriodFromArray('2019-01-01', mockTimesheet.periods);
      // Assert
      expect(actual).toBeNull();
    });
  });
  describe('isTargetDateInTimesheet', () => {
    it('should be returned true if the timesheet is specified period', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = isTargetDateInTimesheet(mockTimesheet, '2020-02-01');
      // Assert
      expect(actual).toBe(true);
    });
    it('should be returned false if targetDate is invalid', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = isTargetDateInTimesheet(mockTimesheet, 'xxxxxx');
      // Assert
      expect(actual).toBe(false);
    });
    it('should be returned false if targetDate is undefined', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = isTargetDateInTimesheet(mockTimesheet);
      // Assert
      expect(actual).toBe(false);
    });
    it('should be returned false if targetDate is over the timesheet period', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = isTargetDateInTimesheet(mockTimesheet, '2020-03-01');
      // Assert
      expect(actual).toBe(false);
    });
    it('should be returned false if targetDate is below the timesheet period', () => {
      // Arrange
      // Act
      // @ts-ignore
      const actual = isTargetDateInTimesheet(mockTimesheet, '2020-01-01');
      // Assert
      expect(actual).toBe(false);
    });
  });
});
