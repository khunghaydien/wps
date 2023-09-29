export type ComplexMatchersType = {
  [K in string]: (
    arg0: {
      [K in string]: string;
    },
    arg1: {
      [K in string]: unknown;
    }
  ) => boolean;
};

export const extractUniqueValues = <T extends Record<string, any>>(
  recordList: T[],
  key: keyof T
): string[] => {
  const values = new Set();
  recordList.forEach((record) => values.add(record[key]));
  const iteratedValues: any = values.values();

  return Array.from(iteratedValues);
};

const getTimeFromISODateString = (ISODateString: string): number => {
  const [year, month, date] = ISODateString.split('-');
  return new Date(Number(year), Number(month) - 1, Number(date)).getTime();
};

export const dateInPeriodMatcher = (
  startDate: string,
  endDate: string,
  targetDate: string
): boolean => {
  if (targetDate === '') {
    return true;
  }

  const targetTime = getTimeFromISODateString(targetDate);
  return (
    getTimeFromISODateString(startDate) <= targetTime &&
    targetTime <= getTimeFromISODateString(endDate)
  );
};

const defaultMatcher = (filterTerm: string, value: string): boolean =>
  filterTerm === '' || (value || '').indexOf(filterTerm) >= 0;

// NOTE: (extraMatchers) => (filterTerms) => (record) => boolean
export const buildRecordFilter =
  <
    T extends {
      [K in string]: string;
    },
    R extends {
      [K in string]: any;
    }
  >(extraMatchers: {
    [K in keyof T]: (t: T, r: R) => boolean;
  }) =>
  (filterTerms: T) =>
  (record: R): boolean =>
    !Object.keys(filterTerms).some((key) =>
      extraMatchers[key]
        ? !extraMatchers[key](filterTerms, record)
        : !defaultMatcher(filterTerms[key], record[key])
    );

export default buildRecordFilter;
