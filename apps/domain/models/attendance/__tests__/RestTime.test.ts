import { create, filter, push, pushLast, remove, update } from '../RestTime';

describe('domain/models/attendance/RestTime', () => {
  describe('create', () => {
    it('should a given restTimes be unchanged', () => {
      // Arrange
      const restTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
        {
          startTime: 1380,
          endTime: 1560,
        },
      ];
      const expectRestTime = restTimes;
      // Act
      const actual = create(restTimes);
      // Assert
      expect(actual).toStrictEqual(expectRestTime);
    });
    it('should be converted from a string to an int', () => {
      // Arrange
      const restTimes = [
        {
          startTime: '540',
          endTime: '600',
        },
        {
          startTime: '660',
          endTime: '780',
        },
        {
          startTime: '840',
          endTime: '1020',
        },
        {
          startTime: '1080',
          endTime: '1200',
        },
        {
          startTime: '1380',
          endTime: '1560',
        },
      ];
      const expectRestTime = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
        {
          startTime: 1380,
          endTime: 1560,
        },
      ];
      // Act
      const actual = create(restTimes);
      // Assert
      expect(actual).toStrictEqual(expectRestTime);
    });
    it('should change the value of it to null if there is an invalid value in the given restTimes', () => {
      // Arrange
      const restTimes = [
        {
          startTime: 'ああああああ',
          endTime: 'Invalid Time',
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: {},
          endTime: {},
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
        {
          startTime: undefined,
          endTime: undefined,
        },
      ];
      const expectRestTime = [
        {
          startTime: null,
          endTime: null,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: null,
          endTime: null,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
        {
          startTime: null,
          endTime: null,
        },
      ];
      // Act
      const actual = create(restTimes);
      // Assert
      expect(actual).toStrictEqual(expectRestTime);
    });
  });
  describe('filter', () => {
    it('should removed from restTimes if startTime and endTime contains a null', () => {
      // Arrange
      const restTimes = [
        {
          startTime: null,
          endTime: 360,
        },
        {
          startTime: 660,
          endTime: null,
        },
        {
          startTime: null,
          endTime: null,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
      ];
      const expectRestTimes = [
        {
          startTime: null,
          endTime: 360,
        },
        {
          startTime: 660,
          endTime: null,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
      ];
      // Act
      const actual = filter(restTimes);
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
  });
  describe('push', () => {
    it('should at the back of the list and the value should remain unchanged', () => {
      // Arrange
      const restTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
      ];
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
        {
          startTime: 1380,
          endTime: 1560,
        },
      ];
      // Act
      const actual = push(restTimes, {
        startTime: 1380,
        endTime: 1560,
      });
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
    it('should not push more than 5 restTime', () => {
      // Arrange
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
        {
          startTime: 1380,
          endTime: 1560,
        },
      ];
      // Act
      const actual = push(expectRestTimes, {
        startTime: 1600,
        endTime: 1660,
      });
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
  });
  describe('pushLast', () => {
    it('should push a restTime with a null value', () => {
      // Arrange
      const restTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
      ];
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: null,
          endTime: null,
        },
      ];
      // Act
      const actual = pushLast(restTimes);
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
    it('should not push more than 5 restTime', () => {
      // Arrange
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
        {
          startTime: 1080,
          endTime: 1200,
        },
        {
          startTime: 1380,
          endTime: 1560,
        },
      ];
      // Act
      const actual = pushLast(expectRestTimes);
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
  });
  describe('remove', () => {
    it('should remove the specified restTime', () => {
      // Arrange
      const restTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
      ];
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
      ];
      // Act
      const actual = remove(restTimes, 1);
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
    it('should not remove the unspecified restTime', () => {
      // Arrange
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
      ];
      // Act
      const actual = remove(expectRestTimes, 3);
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
  });
  describe('update', () => {
    it('should be updated by the specified restTime', () => {
      // Arrange
      const restTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
      ];
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 1200,
          endTime: 1260,
        },
      ];
      // Act
      const actual = update(restTimes, 2, { startTime: 1200, endTime: 1260 });
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
    it('should be updated to null if it contains an invalid value', () => {
      // Arrange
      const restTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: 840,
          endTime: 1020,
        },
      ];
      const expectRestTimes = [
        {
          startTime: 540,
          endTime: 600,
        },
        {
          startTime: 660,
          endTime: 780,
        },
        {
          startTime: null,
          endTime: null,
        },
      ];
      // Act
      const actual = update(restTimes, 2, {
        startTime: 'Invalud Value',
        endTime: undefined,
      });
      // Assert
      expect(actual).toStrictEqual(expectRestTimes);
    });
  });
});
