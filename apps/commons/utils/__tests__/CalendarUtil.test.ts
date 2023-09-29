import { eachDay, parse } from 'date-fns';

import CalendarUtil from '../CalendarUtil';

// TODO
// Rewrite tests for UTC, instead of JST.

describe('CalendarUtil', () => {
  describe('getCalendarAsOf()', () => {
    test('it should return dates of calendar as of `targetDate`', () => {
      // Arrange
      const expected = eachDay(
        parse('2019-06-29T15:00:00Z'),
        parse('2019-08-02T15:00:00Z')
      );
      const targetDate = parse('2019-07-01T00:00:00+09:00:00');

      // Run
      const actual = CalendarUtil.getCalendarAsOf(targetDate);

      // Assert
      expect(actual).toEqual(expected);
    });

    test.each([
      [
        'Sunday',
        parse('2018-06-01T15:00:00Z'),
        { weekStartsOn: 0 },
        eachDay(parse('2018-05-26T15:00:00Z'), parse('2018-06-29T15:00:00Z')),
      ],
      [
        'Monday',
        parse('2019-07-10T15:00:00Z'),
        { weekStartsOn: 1 },
        eachDay(parse('2019-06-30T15:00:00Z'), parse('2019-08-03T15:00:00Z')),
      ],
      [
        'Tuesday',
        parse('2017-09-01T15:00:00Z'),
        { weekStartsOn: 2 },
        eachDay(parse('2017-08-28T15:00:00Z'), parse('2017-10-01T15:00:00Z')),
      ],
      [
        'Wednesday',
        parse('2019-07-10T00:00:00Z'),
        { weekStartsOn: 3 },
        eachDay(parse('2019-06-25T15:00:00Z'), parse('2019-08-05T15:00:00Z')),
      ],
      [
        'Thursday',
        parse('2019-07-10T00:00:00Z'),
        { weekStartsOn: 4 },
        eachDay(parse('2019-06-26T15:00:00Z'), parse('2019-07-30T15:00:00Z')),
      ],
      [
        'Friday',
        parse('2019-07-10T00:00:00Z'),
        { weekStartsOn: 5 },
        eachDay(parse('2019-06-27T15:00:00Z'), parse('2019-07-31T15:00:00Z')),
      ],
      [
        'Saturday',
        parse('2019-07-10T00:00:00Z'),
        { weekStartsOn: 6 },
        eachDay(parse('2019-06-28T15:00:00Z'), parse('2019-08-01T15:00:00Z')),
      ],
    ])(
      'it should return calendar dates of %s beginning calendar as of `%p`',
      (_day, targetDate, weekStartsOn, expected) => {
        // Run
        const actual = CalendarUtil.getCalendarAsOf(
          targetDate,
          weekStartsOn as any
        );

        // Assert
        expect(actual).toEqual(expected);
      }
    );
  });

  describe('getCalendarPeriodAsOf()', () => {
    test('it should return period of calendar as of a given target date', () => {
      // Arrange
      const expected = {
        startDate: parse('2019-06-29T15:00:00Z'),
        endDate: parse('2019-08-03T15:00:00Z'),
      };
      const targetDate = parse('2019-07-01T00:00:00+09:00:00');

      // Act
      const actual = CalendarUtil.getCalendarPeriodAsOf(targetDate);

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
