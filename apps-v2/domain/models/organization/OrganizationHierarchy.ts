import { parse, startOfToday } from 'date-fns';

export type OrganizationHierarchyHistory = {
  id: string;
  hierarchyPatternId: string;
  validDateFrom: string;
  validDateTo: string;
  comment: string;
};

export const sortHistoriesInASC = (histories: OrganizationHierarchyHistory[]) =>
  [...histories].sort(
    (a, b) =>
      parse(a.validDateFrom).valueOf() - parse(b.validDateFrom).valueOf()
  );

export const detectDefaultHistory = (
  histories: OrganizationHierarchyHistory[]
): OrganizationHierarchyHistory => {
  if (!histories || histories.length === 0) {
    return null;
  }

  const today = startOfToday();

  const sortedHistories = sortHistoriesInASC(histories);
  const oldest = sortedHistories[0];
  const newest = sortedHistories[sortedHistories.length - 1];

  if (parse(oldest.validDateFrom) > today) {
    return oldest;
  }
  if (parse(newest.validDateTo) < today) {
    return newest;
  }

  return histories.find(
    (h) => parse(h.validDateFrom) <= today && today <= parse(h.validDateTo)
  );
};
