import schema from './schema';

import msg from '../../../commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { ContractedWorkTime } from '@attendance/domain/models/importer/ContractedWorkTime';
import * as earlyStartWorkRequest from '@attendance/domain/models/importer/DailyRequest/EarlyStartWorkRequest';
import * as overtimeWorkRequest from '@attendance/domain/models/importer/DailyRequest/OvertimeWorkRequest';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import earlyLeaveRequestSchema from './dailyRequest/earlyLeaveRequest';
import holidayWorkRequestSchema from './dailyRequest/holidayWorkRequest';
import lateArrivalRequestSchema from './dailyRequest/lateArrivalRequest';
import { dayType, startEndTime } from './methods';

export default (contractedWorkTime: ContractedWorkTime) =>
  schema
    .object()
    .shape({
      // 出勤時刻 > 退勤時刻の場合
      startTime: schema.number().nullable().concat(dayType(contractedWorkTime)),
      endTime: schema
        .number()
        .nullable()
        .concat(startEndTime('startTime', 'endTime'))
        .when('leaveRequest1Range', {
          is: LEAVE_RANGE.Day,
          then: (schema) => schema.max(-1, msg().Att_Err_NotAllowInpWorkTime),
        }),
      rest1StartTime: schema.number().nullable(),
      rest1EndTime: schema
        .number()
        .nullable()
        .concat(startEndTime('rest1StartTime', 'rest1EndTime')),
      rest2StartTime: schema.number().nullable(),
      rest2EndTime: schema
        .number()
        .nullable()
        .when(
          ['rest1StartTime', 'rest1EndTime', 'rest2StartTime'],
          // @ts-ignore
          (rest1StartTime, rest1EndTime, rest2StartTime) => {
            return schema
              .number()
              .nullable()
              .test(
                'startTimeRequired',
                TextUtil.template(
                  msg().Com_Err_NullValue,
                  msg().Att_Lbl_ImpHeaderRest2StartTime
                ),
                (rest2EndTime) => {
                  return !(
                    (rest2StartTime ?? null) === null &&
                    (rest2EndTime ?? null) !== null
                  );
                }
              )
              .test(
                'endTimeRequired',
                TextUtil.template(
                  msg().Com_Err_NullValue,
                  msg().Att_Lbl_ImpHeaderRest2EndTime
                ),
                (rest2EndTime) => {
                  return !(
                    (rest2StartTime ?? null) !== null &&
                    (rest2EndTime ?? null) === null
                  );
                }
              )
              .test(
                'InvalidEndTimeAndStartTime',
                TextUtil.template(
                  msg().Com_Err_InvalidValueEarlier,
                  msg().Att_Lbl_ImpHeaderRest2StartTime,
                  msg().Att_Lbl_ImpHeaderRest2EndTime
                ),
                (rest2EndTime) => {
                  if (
                    (rest2StartTime ?? null) !== null &&
                    (rest2EndTime ?? null) !== null
                  ) {
                    return rest2StartTime < rest2EndTime;
                  }
                  return true;
                }
              )
              .test(
                'isRestTimeDuplicated',
                msg().Att_Err_OvarlapRestTime,
                (rest2EndTime) => {
                  if (
                    (rest1StartTime ?? null) !== null &&
                    (rest1EndTime ?? null) !== null &&
                    (rest2StartTime ?? null) !== null &&
                    (rest2EndTime ?? null) !== null
                  ) {
                    return !(
                      rest1StartTime < rest2EndTime &&
                      rest1EndTime > rest2StartTime
                    );
                  }
                  return true;
                }
              );
          }
        ),
      leaveRequest1Code: schema
        .string()
        .nullable()
        .when('appliedLeaveRequest1', {
          is: true,
          then: (schema) => schema.required(),
        }),
      leaveRequest1StartTime: schema
        .number()
        .nullable()
        .when('leaveRequest1Range', {
          is: LEAVE_RANGE.Time,
          then: (schema) => schema.required(),
        }),
      leaveRequest1EndTime: schema
        .number()
        .nullable()
        .when('leaveRequest1Range', {
          is: LEAVE_RANGE.Time,
          then: (schema) =>
            schema
              .required()
              .concat(
                startEndTime('leaveRequest1StartTime', 'leaveRequest1EndTime')
              ),
        }),
      leaveRequest1Reason: schema
        .string()
        .nullable()
        .when('leaveRequest1Leave', {
          is: (leave) => leave?.requireReason,
          then: (schema) => schema.required(),
        }),
      overtimeWorkRequestStartTime: schema
        .number()
        .nullable()
        .when('appliedOvertimeWorkRequest', {
          is: true,
          then: schema.number().nullable().required(),
        }),
      overtimeWorkRequestEndTime: schema
        .number()
        .nullable()
        .when('appliedOvertimeWorkRequest', {
          is: true,
          then: (schema) =>
            schema
              .required()
              .concat(
                startEndTime(
                  'overtimeWorkRequestStartTime',
                  'overtimeWorkRequestEndTime'
                )
              ),
        }),
      overtimeWorkRequestRemark: schema
        .string()
        .nullable()
        .when('appliedOvertimeWorkRequest', {
          is: true,
          then: schema
            .string()
            .nullable()
            .max(overtimeWorkRequest.MAX_LENGTH_REMARKS)
            .required(),
        }),
      earlyStartWorkRequestStartTime: schema
        .number()
        .nullable()
        .when('appliedEarlyStartWorkRequest', {
          is: true,
          then: schema.number().nullable().required(),
        }),
      earlyStartWorkRequestEndTime: schema
        .number()
        .nullable()
        .when('appliedEarlyStartWorkRequest', {
          is: true,
          then: (schema) =>
            schema
              .required()
              .concat(
                startEndTime(
                  'earlyStartWorkRequestStartTime',
                  'earlyStartWorkRequestEndTime'
                )
              ),
        }),
      earlyStartWorkRequestRemark: schema
        .string()
        .nullable()
        .when('appliedEarlyStartWorkRequest', {
          is: true,
          then: (schema) =>
            schema.max(earlyStartWorkRequest.MAX_LENGTH_REMARKS).required(),
        }),
    })
    .shape(earlyLeaveRequestSchema)
    .shape(lateArrivalRequestSchema)
    .shape(holidayWorkRequestSchema);
