export type PagingOptions = {
  current: number;
  limitPerPage: number;
  limit?: number;
};

export const getMaxPage = (length: number, limitPerPage: number): number => {
  return Math.ceil(length / limitPerPage);
};

export const isInPages = (
  length: number,
  current: number,
  limitPerPage: number
): boolean => {
  return current >= 1 && current <= getMaxPage(length, limitPerPage);
};

export const roundPage = (
  length: number,
  current: number,
  limitPerPage: number
): number => {
  const maxPage = getMaxPage(length, limitPerPage);
  if (current < 1) {
    return 1;
  } else if (maxPage < current) {
    return maxPage;
  } else {
    return current;
  }
};

export const getRecordStartNumber = (
  page: number,
  limitPerPage: number
): number => {
  return limitPerPage * (page - 1) + 1;
};

export const getRecordEndNumber = (
  page: number,
  limitPerPage: number
): number => {
  return limitPerPage * page;
};

export const getRecordsEachPage = <T>(
  records: T[],
  options: PagingOptions
): T[] => {
  const { current, limitPerPage } = options;
  if (isInPages(records.length, current, limitPerPage)) {
    const page = roundPage(records.length, current, limitPerPage);

    const start = getRecordStartNumber(page, limitPerPage);
    const end = getRecordEndNumber(page, limitPerPage);

    return records.slice(start - 1, end);
  } else {
    return [];
  }
};
