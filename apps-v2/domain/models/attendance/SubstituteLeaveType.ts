import { remove, uniq } from 'lodash';

import { DAY_TYPE, DayType } from './AttDailyRecord';
import { isForReapply } from './AttDailyRequest';
import { HolidayWorkRequest } from './AttDailyRequest/HolidayWorkRequest';
import { WORK_SYSTEM_TYPE, WorkingType } from './WorkingType';

export type SubstituteLeaveType = 'None' | 'Substitute' | 'CompensatoryStocked';

export const SUBSTITUTE_LEAVE_TYPE: {
  [key in SubstituteLeaveType]: SubstituteLeaveType;
} = {
  None: 'None',
  Substitute: 'Substitute',
  CompensatoryStocked: 'CompensatoryStocked',
};

export const ORDER_OF_SUBSTITUTE_LEAVE_TYPES: SubstituteLeaveType[] = [
  SUBSTITUTE_LEAVE_TYPE.None,
  SUBSTITUTE_LEAVE_TYPE.Substitute,
  SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
];

export type ValidPeriodUnitMap = {
  Day: 'Day';
  Monthly: 'Monthly';
};

export type ValidPeriodUnit = ValidPeriodUnitMap[keyof ValidPeriodUnitMap];

export const VALID_PERIOD_UNIT: ValidPeriodUnitMap = {
  Day: 'Day',
  Monthly: 'Monthly',
};

export const create = (
  request: HolidayWorkRequest | null = null,
  workingType: WorkingType | null = null,
  dayType: DayType | null = null
) => {
  const substituteLeaveTypeList = [SUBSTITUTE_LEAVE_TYPE.None];

  if (
    workingType &&
    workingType.holidayWorkConfig &&
    workingType.holidayWorkConfig.substituteLeaveTypeList
  ) {
    substituteLeaveTypeList.push(
      ...workingType.holidayWorkConfig.substituteLeaveTypeList
    );
  }

  if (
    workingType &&
    workingType.workSystem === WORK_SYSTEM_TYPE.JP_Flex &&
    workingType.includesHolidayWorkInPlainTime &&
    dayType === DAY_TYPE.Holiday
  ) {
    remove(
      substituteLeaveTypeList,
      (val) => val === SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked
    );
  }

  if (request && isForReapply(request)) {
    remove(
      substituteLeaveTypeList,
      (val) => val === SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked
    );
  }

  if (request && request.substituteLeaveType) {
    substituteLeaveTypeList.push(request.substituteLeaveType);
  }

  return uniq(substituteLeaveTypeList) as SubstituteLeaveType[];
};
