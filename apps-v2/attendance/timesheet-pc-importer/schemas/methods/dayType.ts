import isNumber from 'lodash/isNumber';

import schema from '../schema';

import msg from '@commons/languages';

import { DAY_TYPE } from '@apps/attendance/domain/models/AttDailyRecord';
import { ContractedWorkTime } from '@attendance/domain/models/importer/ContractedWorkTime';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

export default (contractedWorkTime: ContractedWorkTime) =>
  schema
    .number()
    .nullable()
    .when((value: number | null) =>
      schema.mixed().when('recordDate', (recordDate, $schema) => {
        if (!contractedWorkTime) {
          return $schema;
        }
        const workTime = contractedWorkTime.records?.get(recordDate);
        if (workTime?.dayType === DAY_TYPE.Workday) {
          // 勤務日の場合
          return schema
            .mixed()
            .when(['appliedLeaveRequest1', 'leaveRequest1Range'], {
              is: (appliedLeaveRequest1, leaveRequest1Range) =>
                !appliedLeaveRequest1 || leaveRequest1Range !== LEAVE_RANGE.Day,
              then: schema
                .mixed()
                .test(
                  'workDay',
                  msg().Att_Err_NeedInputStartEndTimeAtWorkDay,
                  () => isNumber(value)
                ),
            });
        } else {
          // 非勤務日の場合
          return schema.mixed().when('appliedHolidayWorkRequest', {
            // 休日出勤申請がない場合
            is: false,
            then: schema
              .mixed()
              .test(
                'holiday',
                msg().Att_Err_CannotInputStartEndTimeAtHoliday,
                () => !isNumber(value)
              ),
          });
        }
      })
    );
