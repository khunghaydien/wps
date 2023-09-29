// @flow

import DateUtil from '../../../commons/utils/DateUtil';

export type HierarchyDisplayObject = {|
  id: string,
  name: string,
  hasChildren: boolean,
|};

export type MasterDepartmentHistory = {|
  historyId: string,
  name: string,
  name_L0: string,
  name_L1: string,
  name_L2: string,
  remarks: string,
  validDateFrom: string,
  validDateTo: string,
  comment: string,
|};

export const defaultValue: MasterDepartmentHistory = {
  historyId: '',
  name: '',
  name_L0: '',
  name_L1: '',
  name_L2: '',
  remarks: '',
  validDateFrom: '',
  validDateTo: '',
  comment: '',
};

export const getClosest = (
  targetDate: string,
  records: MasterDepartmentHistory[]
): MasterDepartmentHistory | null => {
  if (!records.length) {
    return null;
  }

  const targetMsec = DateUtil.toUnixMsec(targetDate);
  let closest = records[0];

  records.forEach((record) => {
    const closestMsec = DateUtil.toUnixMsec(closest.validDateFrom);
    const currentMsec = DateUtil.toUnixMsec(record.validDateFrom);
    const closestDiff = Math.abs(targetMsec - closestMsec);
    const currentDiff = Math.abs(targetMsec - currentMsec);

    if (
      closest.validDateFrom > targetDate &&
      record.validDateFrom <= targetDate
    ) {
      closest = record;
    } else if (currentDiff < closestDiff) {
      closest = record;
    }
  });

  return closest;
};
