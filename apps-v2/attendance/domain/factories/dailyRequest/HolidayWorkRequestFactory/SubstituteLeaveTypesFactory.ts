import remove from 'lodash/remove';
import uniq from 'lodash/uniq';

import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';
import { isForReapply } from '@attendance/domain/models/AttDailyRequest';
import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import * as SubstituteLeaveType from '@attendance/domain/models/SubstituteLeaveType';
import {
  WORK_SYSTEM_TYPE,
  WorkingType,
} from '@attendance/domain/models/WorkingType';

const { SUBSTITUTE_LEAVE_TYPE } = SubstituteLeaveType;

interface ISubstituteLeaveTypesFactory
  extends SubstituteLeaveType.ISubstituteLeaveTypesFactory {
  create: (param?: {
    request?: HolidayWorkRequest;
    workingType?: WorkingType;
    dayType?: DayType;
  }) => SubstituteLeaveType.SubstituteLeaveType[];
}

export default (): ISubstituteLeaveTypesFactory => ({
  create: ({ request, workingType, dayType } = {}) => {
    const substituteLeaveTypeList: SubstituteLeaveType.SubstituteLeaveType[] = [
      SUBSTITUTE_LEAVE_TYPE.None,
    ];

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

    return uniq(substituteLeaveTypeList);
  },
});
