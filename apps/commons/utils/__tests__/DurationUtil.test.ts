import DurationUtil from '../DurationUtil';

describe('toHHmm()', () => {
  test('return 00:00 when 0 was passed', () => {
    expect(DurationUtil.toHHmm(0)).toBe('00:00');
  });
  test('return 00:01 when 1 was passed', () => {
    expect(DurationUtil.toHHmm(1)).toBe('00:01');
  });
  test('return 00:23 when 23 was passed', () => {
    expect(DurationUtil.toHHmm(23)).toBe('00:23');
  });
  test('return 01:00 when 60 was passed', () => {
    expect(DurationUtil.toHHmm(60)).toBe('01:00');
  });
  test('return 11:00 when 660 was passed', () => {
    expect(DurationUtil.toHHmm(660)).toBe('11:00');
  });
  test('return 11:23 when 683 was passed', () => {
    expect(DurationUtil.toHHmm(683)).toBe('11:23');
  });

  test('return -11:23 when -683 was passed', () => {
    expect(DurationUtil.toHHmm(-683)).toBe('-11:23');
  });
  test('return +11:23 when (683, true) were passed', () => {
    expect(DurationUtil.toHHmm(683, true)).toBe('+11:23');
  });

  function invalidCall() {
    return DurationUtil.toHHmm(0.1);
  }

  test('throw TypeError when decimal was passed', () => {
    expect(invalidCall).toThrow(TypeError);
  });
});

describe('static formatDaysAndHoursWithUnit(days: number, hours)', () => {
  describe('If argument specified valid.：return `n days m hours`', () => {
    test('Days and hours are plus.', () => {
      expect(DurationUtil.formatDaysAndHoursWithUnit(2, 2)).toBe(
        '2 days 2 hours'
      );
    });
    test('Days and hours are minus.', () => {
      expect(DurationUtil.formatDaysAndHoursWithUnit(2, 2)).toBe(
        '2 days 2 hours'
      );
    });
  });

  describe('If argument specified invalid.：return `n days`', () => {
    test('Hour is `0`', () => {
      expect(DurationUtil.formatDaysAndHoursWithUnit(2, 0)).toBe('2 days');
    });
    test('Hour is null', () => {
      expect(DurationUtil.formatDaysAndHoursWithUnit(2, null)).toBe('2 days');
    });
    test('Hour is undefined', () => {
      expect(DurationUtil.formatDaysAndHoursWithUnit(2, undefined)).toBe(
        '2 days'
      );
    });
  });

  describe('If day is zero.： return `n hours`', () => {
    test('Hours are plus.', () => {
      expect(DurationUtil.formatDaysAndHoursWithUnit(0, 2)).toBe('2 hours');
    });
    test('Hours are minus.', () => {
      expect(DurationUtil.formatDaysAndHoursWithUnit(0, -2)).toBe('- 2 hours');
    });
  });
});
