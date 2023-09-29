import moment from 'moment';
import { $PropertyType, $ReadOnly } from 'utility-types';

export type Period = {
  name: string;
  label: string;
  year: string;
  monthly: string;
};

export type AttSummaryPeriodList = {
  periods: Period[];
  currentPeriodName: string | null;
};

export type AttSummaryPeriodListFromRemote = $ReadOnly<{
  periods: Period[];
  currentPeriodName: string | null;
}>;

export const createFromRemote = (
  fromRemote: AttSummaryPeriodListFromRemote
): AttSummaryPeriodList => ({
  periods: fromRemote.periods.map((record) => ({ ...record })),
  currentPeriodName: fromRemote.currentPeriodName,
});

export const findPeriodByNameFromPeriods = (
  name: string | null | undefined,
  periods: $PropertyType<AttSummaryPeriodList, 'periods'>
): Period | null =>
  name
    ? periods.find(({ name: periodName }) => periodName === name) || null
    : null;

export const findPeriodByName = (
  name: string | null | undefined,
  attSummaryPeriodList: AttSummaryPeriodList
): Period | null => {
  const { periods, currentPeriodName } = attSummaryPeriodList;
  return findPeriodByNameFromPeriods(name || currentPeriodName, periods);
};

export const getTargetDate = (
  name: string | null | undefined,
  attSummaryPeriodList: AttSummaryPeriodList
): string | null => {
  const targetPeriod = findPeriodByName(name, attSummaryPeriodList);

  if (targetPeriod === null) {
    return null;
  }

  const { year, monthly } = targetPeriod;

  const targetDate = moment({
    year: Number(year),
    month: Number(monthly) - 1,
    day: 1,
  }).format('YYYY-MM-DD');

  return targetDate;
};
