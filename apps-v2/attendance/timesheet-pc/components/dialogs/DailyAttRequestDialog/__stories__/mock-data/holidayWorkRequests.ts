import {
  defaultValue,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  convertFromBase,
  HolidayWorkRequest,
} from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { DIRECT_INPUT } from '@attendance/domain/models/AttPattern';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';
import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

export const noSubstitute: HolidayWorkRequest = convertFromBase({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.None,
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});

export const substitute: HolidayWorkRequest = convertFromBase({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.Substitute,
  substituteDate: '2019-10-10',
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});

export const compensatoryStocked: HolidayWorkRequest = convertFromBase({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});

export const reapply: HolidayWorkRequest = convertFromBase({
  ...defaultValue,
  requestTypeCode: CODE.HolidayWork,
  status: STATUS.APPROVED,
  startDate: '2018-09-02',
  substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.Substitute,
  substituteDate: '2019-10-10',
  startTime: 9 * 60,
  endTime: 22 * 60,
  remarks: 'remarks',
});

const restTimes = [
  {
    startTime: 420,
    endTime: 480,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  {
    startTime: 600,
    endTime: 660,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  {
    startTime: 780,
    endTime: 900,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  {
    startTime: 1020,
    endTime: 1080,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  {
    startTime: 1200,
    endTime: 1260,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
];

export const patterns = [
  {
    name: 'Direct input',
    code: DIRECT_INPUT,
    startTime: null,
    endTime: null,
    restTimes: [],
    workSystem: null,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
  {
    name: WORK_SYSTEM_TYPE.JP_Fix,
    code: 'pattern1',
    startTime: 300,
    endTime: 1320,
    restTimes,
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
  {
    name: WORK_SYSTEM_TYPE.JP_Flex,
    code: 'pattern2',
    startTime: 600,
    endTime: 1140,
    restTimes,
    workSystem: WORK_SYSTEM_TYPE.JP_Flex,
    flexStartTime: 610,
    flexEndTime: 1150,
    withoutCoreTime: false,
  },
  {
    name: WORK_SYSTEM_TYPE.JP_Flex,
    code: 'pattern2',
    startTime: 600,
    endTime: 1140,
    restTimes,
    workSystem: WORK_SYSTEM_TYPE.JP_Flex,
    flexStartTime: 610,
    flexEndTime: 1150,
    withoutCoreTime: true,
  },
  {
    name: WORK_SYSTEM_TYPE.JP_Discretion,
    code: 'pattern2',
    startTime: 600,
    endTime: 1140,
    restTimes,
    workSystem: WORK_SYSTEM_TYPE.JP_Discretion,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
  {
    name: WORK_SYSTEM_TYPE.JP_Manager,
    code: 'pattern2',
    startTime: 600,
    endTime: 1140,
    restTimes,
    workSystem: WORK_SYSTEM_TYPE.JP_Manager,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
  {
    name: WORK_SYSTEM_TYPE.JP_Modified,
    code: 'pattern2',
    startTime: 600,
    endTime: 1140,
    restTimes,
    workSystem: WORK_SYSTEM_TYPE.JP_Modified,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
];
