import DateUtil from '@apps/commons/utils/DateUtil';

export type JobHistory = {
  id: string;
  baseId: string;
  jobType: {
    id: string;
    code: string;
    name: string;
  };
  validDateFrom: string;
  validDateTo: string;
  validDateThrough?: string;
  isDirectCharged: boolean;
  isScopedAssignment: boolean;
  comment: string;
};

export const defaultValue: JobHistory = {
  id: '',
  baseId: '',
  validDateFrom: '',
  validDateTo: '',
  isDirectCharged: true,
  isScopedAssignment: true,
  comment: '',
  jobType: {
    id: '',
    code: '',
    name: '',
  },
};

export const getClosest = (
  targetDate: string,
  records: JobHistory[]
): JobHistory | null => {
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

export default defaultValue;
