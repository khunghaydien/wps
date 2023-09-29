export const MATCHING_TYPE = {
  MATCHED: 'matched',
  UNMATCHED: 'unmatched',
} as const;

export type MatchingType = typeof MATCHING_TYPE[keyof typeof MATCHING_TYPE];

export type AutoHoursAllocationResult = {
  eventId: string;
  import: boolean;
  allocateResult: MatchingType;
  eventTitle: string;
  startTime: string;
  endTime: string;
  job:
    | { id: string; code: string; name: string; hasJobType: boolean }
    | null
    | undefined;
  workCategory: { id: string; code: string; name: string } | null | undefined;
  taskTime: number;
  dictItemId: string;
  isModified: boolean;
  differFromDictionary: boolean;
};

export const judgeModifiedOrNot = (
  updated: AutoHoursAllocationResult,
  original: AutoHoursAllocationResult
): boolean => {
  if (
    updated.job?.id !== original.job?.id ||
    updated.workCategory?.id !== original.workCategory?.id ||
    updated.taskTime !== original.taskTime
  ) {
    return true;
  } else {
    return false;
  }
};

export const calcTotalSelectedTaskTime = (
  updatedAll: AutoHoursAllocationResult[]
): number => {
  let sum = 0;
  updatedAll.forEach((item) => {
    if (item.import) {
      sum += item.taskTime;
    }
  });
  return sum;
};
