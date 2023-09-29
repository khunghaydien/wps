import moment from 'moment';

import 'moment/locale/ja';
import DateUtil, {
  // @ts-ignore eslint-disable-next-line import/named
  __set__,
  errors,
} from '../DateUtil';

const setLocale = (lang: string) =>
  __set__({
    getLocaleFromEmpInfo: () => {
      moment.locale(lang);
      return lang;
    },
  });

describe('commons/utils/DateUtil', () => {
  // ICU has defined the whitespace before AM/PM to be "thin space"
  // @see https://icu.unicode.org/download/72#h.u2dtz3f7ik9a
  const THIN_SPACE = '\u{202f}';

  describe('static nowAsISO8601()', () => {
    const result = DateUtil.nowAsISO8601();

    test('should obey ISO8601 format', () => {
      expect(isNaN(Date.parse(result))).toBeFalsy();
    });
  });

  describe('static getDaysInMonth()', () => {
    test('2017/09 should have 30 days', () => {
      expect(DateUtil.getDaysInMonth('2017-09')).toBe(30);
    });

    test('2017/02 should have 28 days', () => {
      expect(DateUtil.getDaysInMonth('2017-02')).toBe(28);
    });

    test('should throw InvalidDateStringError when invalid argument given', () => {
      expect(() => DateUtil.getDaysInMonth('2017-13')).toThrow(
        errors.InvalidDateStringError
      );
    });
  });

  describe('static getDate() ', () => {
    const sampleResult = DateUtil.getDate('2017-09-01');

    test('年月日の「日」が返却される', () => {
      expect(sampleResult).toBe(1);
    });

    test('数値が返却される', () => {
      expect(typeof sampleResult).toBe('number');
    });
  });

  describe('static formatWeekday() ', () => {
    test('文字列が返却される', () => {
      const actual = DateUtil.formatWeekday('2004-04-04');
      expect(typeof actual).toBe('string');
    });

    test('should throw RangeError for null argument', () => {
      expect(() => DateUtil.formatWeekday(null)).toThrow(RangeError);
    });

    test('should return weekday of `current` for undefined argument', () => {
      setLocale('ja');
      const actual = DateUtil.formatWeekday(undefined);
      expect(actual).toEqual(moment().format('dd'));
    });

    test('should throw RangeError for empty string argument', () => {
      expect(() => DateUtil.formatWeekday('')).toThrow(RangeError);
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2004-04-01T00:00Z',
        formatted: '木',
      },
      {
        lang: 'ja',
        input: '2004-04-04',
        formatted: '日',
      },
      {
        lang: 'en-US',
        input: '2004-04-01',
        formatted: 'Thu',
      },
      {
        lang: 'en',
        input: '2004-04-02',
        formatted: 'Fri',
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeAll(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} Weekday`, () => {
        const actual = DateUtil.formatWeekday(input);
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formatYMDhhmm()', () => {
    test('文字列が返却される', () => {
      const result = DateUtil.formatYMDhhmm('2004-04-01T12:00Z');
      expect(typeof result).toBe('string');
    });

    test('should throw RangeError for null argument', () => {
      expect(() => DateUtil.formatYMDhhmm(null)).toThrow(RangeError);
    });

    test('should return today for undefined argument', () => {
      setLocale('ja');
      const expected = moment().format('YYYY/MM/DD');
      const actual = DateUtil.formatYMDhhmm(undefined);

      // 時刻も含まれているが、テスト都合でカットする
      expect(moment(new Date(actual)).format('YYYY/MM/DD')).toEqual(expected);
    });

    test('should throw RangeError for empty string argument', () => {
      expect(() => DateUtil.formatYMDhhmm('')).toThrow(RangeError);
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2004-04-01T12:00Z',
        formatted: '2004/4/1 12:00',
      },
      {
        lang: 'ja',
        input: '2004-04-01T12:00Z',
        formatted: '2004/4/1 12:00',
      },
      {
        lang: 'en-US',
        input: '2004-04-01T12:00Z',
        formatted: `Apr 1, 2004, 12:00${THIN_SPACE}PM`,
      },
      {
        lang: 'en',
        input: '2004-04-01T12:00Z',
        formatted: `Apr 1, 2004, 12:00${THIN_SPACE}PM`,
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} YMDhhmm`, () => {
        const actual = DateUtil.formatYMDhhmm(input, 'UTC');
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formathhmm()', () => {
    test('文字列が返却される', () => {
      const result = DateUtil.formathhmm('2004-04-01T12:00Z');
      expect(typeof result).toBe('string');
    });

    test('should return empty string for null argument', () => {
      expect(DateUtil.formathhmm(null)).toEqual('');
    });

    test('should return current hours and minutes for undefined argument', () => {
      setLocale('ja');
      const actual = DateUtil.formathhmm(undefined);

      // 時間のテストは実行時に変動してしまうので出来ない
      // 代わりにHH:MMのフォーマットで帰ってきてることだけテストする
      const [hh, mm] = actual.split(/:/);
      expect(hh).toBeDefined();
      expect(mm).toBeDefined();
    });

    test('should return empty string for empty string argument', () => {
      expect(DateUtil.formathhmm('')).toEqual('');
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2004-04-01T12:00Z',
        formatted: '12:00',
      },
      {
        lang: 'ja',
        input: '2004-04-01T12:00Z',
        formatted: '12:00',
      },
      {
        lang: 'en-US',
        input: '2004-04-01T12:00Z',
        formatted: `12:00${THIN_SPACE}PM`,
      },
      {
        lang: 'en',
        input: '2004-04-01T12:00Z',
        formatted: `12:00${THIN_SPACE}PM`,
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} hhmm`, () => {
        const actual = DateUtil.formathhmm(input, 'UTC');
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formatYMD()', () => {
    test('文字列が返却される', () => {
      const result = DateUtil.formatYMD('2004-04-01T12:00Z');
      expect(typeof result).toBe('string');
    });

    test('should return empty string for null argument', () => {
      expect(DateUtil.formatYMD(null)).toEqual('');
    });

    test('should return empty string for undefined argument', () => {
      expect(DateUtil.formatYMD(undefined)).toEqual('');
    });

    test('should return empty string for empty string argument', () => {
      expect(DateUtil.formatYMD('')).toEqual('');
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2010-12-10T12:00Z',
        formatted: '2010/12/10',
      },
      {
        lang: 'ja',
        input: '2004-04-10T12:00Z',
        formatted: '2004/4/10',
      },
      {
        lang: 'en-US',
        input: '2004-04-01T12:00Z',
        formatted: 'Apr 1, 2004',
      },
      {
        lang: 'en',
        input: '2005-05-02T12:00Z',
        formatted: 'May 2, 2005',
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} YMD`, () => {
        const actual = DateUtil.formatYMD(input);
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formatMDW()', () => {
    test('文字列が返却される', () => {
      const result = DateUtil.formatMDW('2004-04-01T12:00Z');
      expect(typeof result).toBe('string');
    });

    test('should return empty string for null argument', () => {
      expect(DateUtil.formatMDW(null)).toEqual('');
    });

    test('should return current month and date and weekday for undefined argument', () => {
      setLocale('ja');

      // 今日の日付を見たいので、一桁日と二桁日に注意すること
      const actual = DateUtil.formatMDW(undefined);
      expect(actual).toEqual(moment().format('M/D(dd)'));
    });

    test('should return empty string for empty string argument', () => {
      expect(DateUtil.formatMDW('')).toEqual('');
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2010-12-10T12:00Z',
        formatted: '12/10(金)',
      },
      {
        lang: 'ja',
        input: '2004-04-10T12:00Z',
        formatted: '4/10(土)',
      },
      {
        lang: 'en-US',
        input: '2004-04-01T12:00Z',
        formatted: 'Thu, Apr 1',
      },
      {
        lang: 'en',
        input: '2005-05-02T12:00Z',
        formatted: 'Mon, May 2',
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} YMD`, () => {
        const actual = DateUtil.formatMDW(input);
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formatDW()', () => {
    test('文字列が返却される', () => {
      const result = DateUtil.formatDW('2004-04-01T12:00Z');
      expect(typeof result).toBe('string');
    });

    test('should return empty string for null argument', () => {
      expect(DateUtil.formatDW(null)).toEqual('');
    });

    test('should return current date and weekday for undefined argument', () => {
      setLocale('ja');

      // 今日の日付を見たいので、一桁日と二桁日に注意すること
      const actual = DateUtil.formatDW(undefined);
      expect(actual).toEqual(moment().format('D日(dd)'));
    });

    test('should return empty for empty string argument', () => {
      expect(DateUtil.formatDW('')).toEqual('');
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2010-12-10T12:00Z',
        formatted: '10日(金)',
      },
      {
        lang: 'ja',
        input: '2004-04-10T12:00Z',
        formatted: '10日(土)',
      },
      {
        lang: 'en-US',
        input: '2004-04-01T12:00Z',
        formatted: '1 Thu',
      },
      {
        lang: 'en',
        input: '2005-05-02T12:00Z',
        formatted: '2 Mon',
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} YMD`, () => {
        const actual = DateUtil.formatDW(input);
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formatYM()', () => {
    test('文字列が返却される', () => {
      const result = DateUtil.formatYM('2004-04-01T12:00Z');
      expect(typeof result).toBe('string');
    });

    test('should return empty string for null argument', () => {
      expect(DateUtil.formatYM(null)).toEqual('');
    });

    test('should return empty string for undefined argument', () => {
      setLocale('ja');
      expect(DateUtil.formatYM(undefined)).toEqual('');
    });

    test('should return empty string for empty string argument', () => {
      expect(DateUtil.formatYM('')).toEqual('');
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2010-12-10T12:00Z',
        formatted: '2010/12',
      },
      {
        lang: 'ja',
        input: '2004-04-10T12:00Z',
        formatted: '2004/4',
      },
      {
        lang: 'en-US',
        input: '2004-04-01T12:00Z',
        formatted: 'Apr 2004',
      },
      {
        lang: 'en',
        input: '2005-05-02T12:00Z',
        formatted: 'May 2005',
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} YM`, () => {
        const actual = DateUtil.formatYM(input);
        expect(actual).toEqual(formatted);
      });
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: '2010-12-10T12:00Z',
        formatted: '2010年12月',
      },
      {
        lang: 'ja',
        input: '2004-04-10T12:00Z',
        formatted: '2004年4月',
      },
      {
        lang: 'en-US',
        input: '2004-09-01T12:00Z',
        formatted: 'September 2004',
      },
      {
        lang: 'en',
        input: '2005-05-02T12:00Z',
        formatted: 'May 2005',
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} YLongM`, () => {
        const actual = DateUtil.formatYLongM(input);
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formatDaysWithUnit()', () => {
    test('文字列が返却される', () => {
      // @ts-ignore
      const result = DateUtil.formatDaysWithUnit('2004-04-01T12:00Z');
      expect(typeof result).toBe('string');
    });

    test("should return 'null days' for null argument", () => {
      expect(DateUtil.formatDaysWithUnit(null)).toEqual('null days');
    });

    test('should return `unexpected days` for undefined argument', () => {
      setLocale('en');
      expect(DateUtil.formatDaysWithUnit(undefined)).toEqual('undefined days');
    });

    test('should return ` days` for empty string argument', () => {
      // @ts-ignore
      expect(DateUtil.formatDaysWithUnit('')).toEqual(' days');
    });

    describe.each([
      {
        lang: 'ja-JP',
        input: 10,
        formatted: '10日',
      },
      {
        lang: 'ja',
        input: 1,
        formatted: '1日',
      },
      {
        lang: 'en-US',
        input: 31,
        formatted: '31 days',
      },
      {
        lang: 'en',
        input: '9',
        formatted: '9 days',
      },
    ])('%p', ({ lang, input, formatted }) => {
      beforeEach(() => {
        setLocale(lang);
      });

      test(`${lang}: Format ${input} YMD`, () => {
        // @ts-ignore
        const actual = DateUtil.formatDaysWithUnit(input);
        expect(actual).toEqual(formatted);
      });
    });
  });

  describe('static formatDateStrToSlashes()', () => {
    test('should throw error for null argument', () => {
      expect(() => DateUtil.formatDateStrToSlashes(null)).toThrow(TypeError);
    });

    test('should thow error for undefined argument', () => {
      setLocale('en');
      expect(() => DateUtil.formatDateStrToSlashes(undefined)).toThrow(
        TypeError
      );
    });

    test('should thow error for empty string argument', () => {
      expect(() => DateUtil.formatDateStrToSlashes()).toThrow(TypeError);
    });

    test('-をslashに置き換える', () => {
      const result = DateUtil.formatDateStrToSlashes('2004-04-01');
      expect(result).toEqual('2004/04/01');
    });
  });

  describe('static addDays()', () => {
    describe('正の整数', () => {
      test('未来の日付が返却される', () => {
        expect(DateUtil.addDays('2018-05-21', 1)).toBe('2018-05-22');
      });
    });

    describe('負の整数', () => {
      test('過去の日付が返却される', () => {
        expect(DateUtil.addDays('2018-05-21', -1)).toBe('2018-05-20');
      });
    });
  });

  describe('static formatLongDate()', () => {
    describe('invalid date', () => {
      test('it should throw an exception', () => {
        // Arrange
        setLocale('en');

        // Run
        const actual = () => DateUtil.formatLongDate('adfgsjdlfkgj');

        // Assert
        expect(actual).toThrow(RangeError);
      });
    });
    describe('valid date', () => {
      test('it should return a formatted date string', () => {
        // Arrange
        setLocale('en');
        const expected = 'September 1, 2019';

        // Run
        const actual = DateUtil.formatLongDate('2019-09-01');

        // Assert
        expect(actual).toBe(expected);
      });
    });
  });

  describe('static inRange()', () => {
    test.each([
      ['2019-10-01', '2019-09-15', '2019-12-01', true],
      ['2019-10-01', '2019-10-01', '2019-12-01', true],
      ['2019-12-01', '2019-10-01', '2019-12-01', true],
      ['2019-09-01', '2019-10-01', '2019-12-01', false],
      ['2020-01-01', '2019-10-01', '2019-12-01', false],
      [
        '2019-09-30T23:59:59Z',
        '2019-10-01T00:00:00Z',
        '2019-12-01T00:00:00Z',
        false,
      ],
      [
        '2020-01-01T00:00:00Z',
        '2019-10-01T00:00:00Z',
        '2019-12-31T23:59:59Z',
        false,
      ],
      [
        '2019-10-01T00:00:01Z',
        '2019-10-01T00:00:00Z',
        '2019-12-01T00:00:00Z',
        true,
      ],
      [
        '2019-12-31T23:59:59Z',
        '2019-10-01T00:00:00Z',
        '2020-01-01T00:00:00Z',
        true,
      ],
    ])(
      'test that %s is between %s and %s or not',
      (targetDate, startDate, endDate, expected) => {
        // Run
        const actual = DateUtil.inRange(targetDate, startDate, endDate);

        // Assert
        expect(actual).toBe(expected);
      }
    );
  });
  describe('static getAllDates()', () => {
    test.each([
      ['2022-12-01', '2022-12-01', ['2022-12-01']],
      ['2022-12-01', '2022-12-03', ['2022-12-01', '2022-12-02', '2022-12-03']],
      [
        '2022-12-05',
        '2022-12-15',
        [
          '2022-12-05',
          '2022-12-06',
          '2022-12-07',
          '2022-12-08',
          '2022-12-09',
          '2022-12-10',
          '2022-12-11',
          '2022-12-12',
          '2022-12-13',
          '2022-12-14',
          '2022-12-15',
        ],
      ],
      [
        '2022-11-28',
        '2022-12-05',
        [
          '2022-11-28',
          '2022-11-29',
          '2022-11-30',
          '2022-12-01',
          '2022-12-02',
          '2022-12-03',
          '2022-12-04',
          '2022-12-05',
        ],
      ],
      [
        '2022-12-30',
        '2023-01-03',
        ['2022-12-30', '2022-12-31', '2023-01-01', '2023-01-02', '2023-01-03'],
      ],
    ])('test that %s and %s in %s or not', (startDate, endDate, expected) => {
      // Run
      const actual = DateUtil.getRangeDays(startDate, endDate);

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
