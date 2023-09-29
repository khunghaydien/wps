import _ from 'lodash';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

const dayTypeByWeekdayTranslations = [
  DAY_TYPE.LegalHoliday,
  ...new Array(5).fill(DAY_TYPE.Workday),
  DAY_TYPE.Holiday,
];

/**
 * Determine if the weekday is workday or not and return a member of DayType.
 * @param {number} weekday Weekday.
 * @return {string} A member of DayType.
 * @see DayType
 * @example
 * // Determine today is a workday
 * getDayTypeByWeekday(new Date().getDay()) === DayType.WORKDAY
 */
const getDayTypeByWeekday = (weekday) =>
  dayTypeByWeekdayTranslations[weekday] || DAY_TYPE.Workday;

/**
 * Generate mock records in 2017/09.
 * @return {Object[]} 30 mock records (2017/09 has 30 days) start at 9:00 and end at 18:00.
 * @example
 * // Add records key to mock response
 * mockResponse = {
 *   ...mockResponse,
 *   records: generateMockRecords(),
 * }
 */
export const generateMockRecords = () => {
  return _.range(1, 30 + 1).map((day) => {
    const date = new Date();
    date.setFullYear(2017);
    date.setMonth(9 - 1);
    date.setDate(day);

    const weekday = date.getDay();
    const dayType = getDayTypeByWeekday(weekday);

    let startTime = null;
    let endTime = null;
    let restTime = null;
    let realWorkTime = null;
    if (dayType === DAY_TYPE.Workday) {
      startTime = 9 * 60;
      endTime = 18 * 60;
      restTime = 60;
      realWorkTime = 8 * 60;
    }

    return {
      recordDate: date.toISOString().slice(0, 10),
      dayType,
      event: null,
      commuteCountForward: null,
      commuteCountBackward: null,
      startTime,
      endTime,
      startStampTime: startTime,
      endStampTime: endTime,
      restTime,
      realWorkTime,
      overTime: null,
      nightTime: null,
      lostTime: null,
      remarks: null,
    };
  });
};

// To keep dummy data creation code simply

/**
 * Generate summary group object.
 * @param {string} name Name of summary group.
 * @param {Object[]} items Items in the summary group.
 * @return {Object} Generated summary group object.
 * @see generateSummaryItem
 * @example
 * generateSummaryGroup('DaysSummary', [
 *   generateSummaryItem('ContractualWorkDays', 'days', 11),
 *   generateSummaryItem('RealWorkDays', 'days', 11),
 *   generateSummaryItem('LegalHolidayWorkCount', 'days', 11),
 *   generateSummaryItem('HolidayWorkCount', 'days', 11),
 * ]),
 */
export const generateSummaryGroup = (name, items) => ({
  name,
  items,
});

/**
 * Generate summary item object.
 * @param {string} name Summary name.
 * @param {string} unit Unit of value.
 * @param {...number} values Value. If the unit is 'daysAndHours',
 *     it requires 2 values, days and hours (in minutes ...).
 * @return {Object[]} Generated summary item object.
 * @see generateSummaryGroup
 * @example
 * generateSummaryItem('ContractualWorkDays', 'days', 11),
 */
export const generateSummaryItem = (name, unit, ...values) => ({
  name,
  value: unit !== 'daysAndHours' ? values[0] : null,
  daysAndHours:
    unit === 'daysAndHours'
      ? {
          days: values[0],
          hours: values[1],
        }
      : null,
  unit,
});
