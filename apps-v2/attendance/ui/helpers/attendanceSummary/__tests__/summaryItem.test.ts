import msg, { language } from '@apps/commons/languages';

import {
  SUMMARY_ITEM_NAME,
  UNIT,
} from '@attendance/domain/models/BaseAttendanceSummary';

import {
  // @ts-ignore
  __get__,
  closingDate,
  label,
  value,
} from '../summaryItem';

let _empInfo;
beforeAll(() => {
  _empInfo = window.empInfo;
  Object.defineProperty(window, 'empInfo', {
    ..._empInfo,
    language: language.EN_US,
    locale: language.EN_US,
  });
});

afterAll(() => {
  Object.defineProperty(window, 'empInfo', _empInfo);
});

describe('label()', () => {
  it('should do.', () => {
    // @ts-ignore
    const messageMap = __get__('messageIdByItemNameTranslations');
    Object.keys(SUMMARY_ITEM_NAME).forEach((key) => {
      const name = SUMMARY_ITEM_NAME[key];
      const result = label(name);
      expect(result).toBe(msg()[messageMap[name]]);
      expect(result).toBeTruthy();
    });
  });

  it("should return ''.", () => {
    expect(label('TEST')).toBe('');
  });
});

describe('value()', () => {
  it("should return '* days' if unit is days", () => {
    expect(
      value({
        unit: UNIT.DAYS,
        value: 100,
      })
    ).toEqual('100 days');
    expect(
      value({
        unit: UNIT.DAYS,
        value: null,
      })
    ).toEqual('0 days');
  });
  it("should return 'hh:mm' if unit is hours", () => {
    expect(
      value({
        unit: UNIT.HOURS,
        value: 21 * 60 + 35,
      })
    ).toBe('21:35');
    expect(
      value({
        unit: UNIT.HOURS,
        value: null,
      })
    ).toBe('');
  });
  it("should return '* times' if unit is count", () => {
    expect(
      value({
        unit: UNIT.COUNT,
        value: 10,
      })
    ).toBe(`10 times`);
    expect(
      value({
        unit: UNIT.COUNT,
        value: null,
      })
    ).toBe(`0 times`);
  });
  it("should return '* days * hours' if unit is dayAndHours", () => {
    expect(
      value({
        unit: UNIT.DAYS_AND_HOURS,
        value: 10,
        daysAndHours: {
          days: 5,
          hours: 7,
        },
      })
    ).toBe('5 days 7 hours');
    expect(
      value({
        unit: UNIT.DAYS_AND_HOURS,
        value: null,
        daysAndHours: {
          days: null,
          hours: null,
        },
      })
    ).toBe('0 days');
  });
  it("should return '*' if unit is null", () => {
    expect(
      value({
        unit: null,
        value: 99,
      })
    ).toBe(99);
    expect(
      value({
        unit: null,
        value: null,
      })
    ).toBe(null);
  });
  it("should return '±hh:mm' if name is DifferenceTime", () => {
    expect(
      value({
        name: 'DifferenceTime',
        value: 77,
      })
    ).toBe('+01:17');
  });
  it("should return '*' if name is DifferenceTime but value is string", () => {
    expect(
      value({
        name: 'DifferenceTime',
        value: '77' as unknown as number,
      })
    ).toBe('77');
    expect(
      value({
        name: 'DifferenceTime',
        value: null,
      })
    ).toBe(null);
    expect(
      value({
        name: 'DifferenceTime',
        value: '' as unknown as number,
      })
    ).toBe('');
  });
});

describe('closingDate', () => {
  it('should do', () => {
    // Act
    const result = closingDate('2020-01-01');

    // Arrange
    expect(result).toBe('(as at Jan 1, 2020)');
  });

  it("should not do when closingDate is ''", () => {
    expect(closingDate('')).toBe(null);
  });
});
