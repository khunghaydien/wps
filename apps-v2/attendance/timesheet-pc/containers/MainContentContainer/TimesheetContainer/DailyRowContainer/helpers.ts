import isEqual from 'lodash/isEqual';

import { DailyRecordDisplayFieldLayoutItemValueForUI } from '@attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

export const fieldChanged = ({
  orignValues,
  currentValues,
}: {
  orignValues: {
    [itemId: string]: DailyRecordDisplayFieldLayoutItemValueForUI;
  };
  currentValues: {
    [itemId: string]: DailyRecordDisplayFieldLayoutItemValueForUI;
  };
}): boolean => {
  return !isEqual(orignValues, currentValues);
};
