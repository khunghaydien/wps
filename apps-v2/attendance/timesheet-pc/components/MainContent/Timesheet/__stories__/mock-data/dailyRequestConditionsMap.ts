import DailyRequestConditions from '../../../../../models/DailyRequestConditions';
import { create as createAbsenceRequest } from '@attendance/domain/models/AttDailyRequest/AbsenceRequest';
import {
  defaultValue,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { convertFromBase as convertHolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { convertFromBase as createLeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

const dailyRequestConditionsMap: {
  [key: string]: DailyRequestConditions;
} = {
  '2020-02-01': {
    recordDate: '2020-02-01',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-02': {
    recordDate: '2020-02-02',
    latestRequests: [
      convertHolidayWorkRequest({
        ...defaultValue,
        id: 'a012v000033TVVjAAO',
        requestTypeCode: 'HolidayWork',
        requestTypeName: '休日出勤',
        status: 'Approved',
        startDate: '2020-02-02',
        endDate: '2020-02-02',
        startTime: 540,
        endTime: 1080,
        remarks: '',
        reason: '',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: 'Substitute',
        substituteDate: '2020-02-04',
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-03': {
    recordDate: '2020-02-03',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-04': {
    recordDate: '2020-02-04',
    latestRequests: [
      convertHolidayWorkRequest({
        ...defaultValue,
        id: 'a012v000033TVVjAAO',
        requestTypeCode: 'HolidayWork',
        requestTypeName: '休日出勤',
        status: 'Approved',
        startDate: '2020-02-02',
        endDate: '2020-02-02',
        startTime: 540,
        endTime: 1080,
        remarks: '',
        reason: '',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: 'Substitute',
        substituteDate: '2020-02-04',
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-05': {
    recordDate: '2020-02-05',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-06': {
    recordDate: '2020-02-06',
    latestRequests: [
      createLeaveRequest({
        ...defaultValue,
        id: 'a012v000033TVRXAA4',
        requestTypeCode: 'Leave',
        requestTypeName: '休暇',
        status: 'Approved',
        startDate: '2020-02-06',
        endDate: '2020-02-06',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: '',
        leaveName: '有給休暇',
        leaveCode: 'paidLeave',
        leaveType: 'Paid',
        leaveRange: 'Day',
        leaveDetailCode: 'leaveDetail',
        leaveDetailName: '休暇内訳',
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [
      createLeaveRequest({
        ...defaultValue,
        id: 'a012v000033TVRXAA4',
        requestTypeCode: 'Leave',
        requestTypeName: '休暇',
        status: 'Approved',
        startDate: '2020-02-06',
        endDate: '2020-02-06',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: '',
        leaveName: '有給休暇',
        leaveCode: 'paidLeave',
        leaveType: 'Paid',
        leaveRange: 'Day',
        leaveDetailCode: 'leaveDetail',
        leaveDetailName: '休暇内訳',
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    effectualAllDayLeaveType: 'Paid',
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-07': {
    recordDate: '2020-02-07',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-08': {
    recordDate: '2020-02-08',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-09': {
    recordDate: '2020-02-09',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-10': {
    recordDate: '2020-02-10',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-11': {
    recordDate: '2020-02-11',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-12': {
    recordDate: '2020-02-12',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-13': {
    recordDate: '2020-02-13',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-14': {
    recordDate: '2020-02-14',
    latestRequests: [
      {
        id: 'a012v000033TVVtAAO',
        requestTypeCode: 'Absence',
        requestTypeName: '欠勤',
        status: 'Approved',
        startDate: '2020-02-14',
        endDate: '2020-02-14',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: 'maaaaaaa',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
        type: 'Absence',
        personalReason: false,
        useManagePersonalReason: false,
        workSystem: null,
        flexStartTime: null,
        flexEndTime: null,
        withoutCoreTime: false,
        requestDayType: 'Holiday',
        requestableDayType: 'Holiday',
        canDirectInputTimeRequest: false,
        isDirectInputTimeRequest: false,
        reasonId: '',
        reasonName: '',
        reasonCode: '',
        useLateArrivalReason: false,
        useEarlyLeaveReason: false,
      },
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: true,
    isLocked: false,
  },
  '2020-02-15': {
    recordDate: '2020-02-15',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-16': {
    recordDate: '2020-02-16',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-17': {
    recordDate: '2020-02-17',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-18': {
    recordDate: '2020-02-18',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-19': {
    recordDate: '2020-02-19',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      Leave: {
        name: '休暇',
        code: 'Leave',
      },
      OvertimeWork: {
        name: '残業',
        code: 'OvertimeWork',
      },
      EarlyStartWork: {
        name: '早朝勤務',
        code: 'EarlyStartWork',
      },
      Absence: {
        name: '欠勤',
        code: 'Absence',
      },
      Direct: {
        name: '直行直帰',
        code: 'Direct',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: true,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-20': {
    recordDate: '2020-02-20',
    latestRequests: [
      createAbsenceRequest({
        ...defaultValue,
        id: 'a012v000033TVWcAAO',
        requestTypeCode: 'Absence',
        requestTypeName: '欠勤',
        status: 'Approved',
        startDate: '2020-02-20',
        endDate: '2020-02-28',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: 'aaaaaaaaaaa',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: true,
    isLocked: false,
  },
  '2020-02-21': {
    recordDate: '2020-02-21',
    latestRequests: [
      createAbsenceRequest({
        ...defaultValue,
        id: 'a012v000033TVWcAAO',
        requestTypeCode: 'Absence',
        requestTypeName: '欠勤',
        status: 'Approved',
        startDate: '2020-02-20',
        endDate: '2020-02-28',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: 'aaaaaaaaaaa',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: true,
    isLocked: false,
  },
  '2020-02-22': {
    recordDate: '2020-02-22',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-23': {
    recordDate: '2020-02-23',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-24': {
    recordDate: '2020-02-24',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
  '2020-02-25': {
    recordDate: '2020-02-25',
    latestRequests: [
      createAbsenceRequest({
        ...defaultValue,
        id: 'a012v000033TVWcAAO',
        requestTypeCode: 'Absence',
        requestTypeName: '欠勤',
        status: 'Approved',
        startDate: '2020-02-20',
        endDate: '2020-02-28',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: 'aaaaaaaaaaa',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: true,
    isLocked: false,
  },
  '2020-02-26': {
    recordDate: '2020-02-26',
    latestRequests: [
      createAbsenceRequest({
        ...defaultValue,
        id: 'a012v000033TVWcAAO',
        requestTypeCode: 'Absence',
        requestTypeName: '欠勤',
        status: 'Approved',
        startDate: '2020-02-20',
        endDate: '2020-02-28',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: 'aaaaaaaaaaa',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: true,
    isLocked: false,
  },
  '2020-02-27': {
    recordDate: '2020-02-27',
    latestRequests: [
      createAbsenceRequest({
        ...defaultValue,
        id: 'a012v000033TVWcAAO',
        requestTypeCode: 'Absence',
        requestTypeName: '欠勤',
        status: 'Approved',
        startDate: '2020-02-20',
        endDate: '2020-02-28',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: 'aaaaaaaaaaa',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: true,
    isLocked: false,
  },
  '2020-02-28': {
    recordDate: '2020-02-28',
    latestRequests: [
      createAbsenceRequest({
        ...defaultValue,
        id: 'a012v000033TVWcAAO',
        requestTypeCode: 'Absence',
        requestTypeName: '欠勤',
        status: 'Approved',
        startDate: '2020-02-20',
        endDate: '2020-02-28',
        startTime: null,
        endTime: null,
        remarks: '',
        reason: 'aaaaaaaaaaa',
        leaveName: null,
        leaveCode: null,
        leaveType: null,
        leaveRange: null,
        leaveDetailCode: null,
        leaveDetailName: null,
        substituteLeaveType: null,
        substituteDate: null,
        directApplyRestTimes: [],
        patternCode: null,
        patternName: null,
        patternRestTimes: [],
        requireReason: false,
        originalRequestId: null,
        isForReapply: false,
        approver01Name: '渡邉 航',
      }),
    ],
    availableRequestCount: 1,
    availableRequestTypes: {},
    remarkableRequestStatus: STATUS.APPROVED,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: false,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: true,
    isLocked: false,
  },
  '2020-02-29': {
    recordDate: '2020-02-29',
    latestRequests: [],
    availableRequestCount: 0,
    availableRequestTypes: {
      HolidayWork: {
        name: '休日出勤',
        code: 'HolidayWork',
      },
    },
    remarkableRequestStatus: null,
    isAvailableToOperateAttTime: false,
    isAvailableToEntryNewRequest: true,
    isAvailableToModifySubmittedRequest: true,
    isAllowWorkDuringLeaveOfAbsence: false,
    effectualLeaveRequests: [],
    effectualAllDayLeaveType: null,
    isApprovedAbsence: false,
    isLocked: false,
  },
};

export default dailyRequestConditionsMap;
