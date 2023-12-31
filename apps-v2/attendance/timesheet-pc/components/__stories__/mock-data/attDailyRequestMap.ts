import {
  createFromDefaultValue,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

const dummyRequestTypeMap = {
  [CODE.Leave]: {
    code: CODE.Leave,
    name: 'Leave',
  },
};

const dummyRequestsMap = {
  [STATUS.REJECTED]: createFromDefaultValue(
    CODE.Leave,
    {
      dailyRecord: null,
      nameMap: dummyRequestTypeMap,
    },
    {
      id: '000001',
      status: STATUS.REJECTED,
      requestTypeCode: CODE.Leave,
      requestTypeName: '休暇申請',
      leaveType: 'Paid',
      startDate: '2020-01-01',
      endDate: '2020-01-01',
      startTime: null,
      endTime: null,
      remarks: '',
      reason: '',
      leaveCode: null,
      leaveName: null,
      leaveRange: null,
      leaveDetailCode: null,
      leaveDetailName: null,
      substituteLeaveType: null,
      substituteDate: null,
      directApplyRestTimes: [],
      patternCode: null,
      patternName: null,
      patternRestTimes: [],
      originalRequestId: null,
      isForReapply: false,
      requireReason: false,
      approver01Name: 'approver01Name',
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
      useLateArrivalReason: false,
      useEarlyLeaveReason: false,
      reasonId: '',
      reasonName: '',
      reasonCode: '',
    }
  ),
  [STATUS.APPROVAL_IN]: createFromDefaultValue(
    CODE.Leave,
    {
      dailyRecord: null,
      nameMap: dummyRequestTypeMap,
    },
    {
      id: '000002',
      status: STATUS.APPROVAL_IN,
      requestTypeCode: CODE.Leave,
      requestTypeName: '休暇申請',
      leaveType: 'Paid',
      startDate: '2020-01-02',
      endDate: '2020-01-02',
      startTime: null,
      endTime: null,
      remarks: '',
      reason: '',
      leaveCode: null,
      leaveName: null,
      leaveRange: null,
      leaveDetailCode: null,
      leaveDetailName: null,
      substituteLeaveType: null,
      substituteDate: null,
      directApplyRestTimes: [],
      patternCode: null,
      patternName: null,
      patternRestTimes: [],
      originalRequestId: null,
      isForReapply: false,
      requireReason: false,
      approver01Name: 'approver01Name',
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
      useLateArrivalReason: false,
      useEarlyLeaveReason: false,
      reasonId: '',
      reasonName: '',
      reasonCode: '',
    }
  ),
  [STATUS.APPROVED]: createFromDefaultValue(
    CODE.Leave,
    {
      dailyRecord: null,
      nameMap: dummyRequestTypeMap,
    },
    {
      id: '000003',
      status: STATUS.APPROVED,
      requestTypeCode: CODE.Leave,
      requestTypeName: '休暇申請',
      leaveType: 'Paid',
      startDate: '2020-01-02',
      endDate: '2020-01-02',
      startTime: null,
      endTime: null,
      remarks: '',
      reason: '',
      leaveCode: null,
      leaveName: null,
      leaveRange: null,
      leaveDetailCode: null,
      leaveDetailName: null,
      substituteLeaveType: null,
      substituteDate: null,
      directApplyRestTimes: [],
      patternCode: null,
      patternName: null,
      patternRestTimes: [],
      originalRequestId: null,
      isForReapply: false,
      requireReason: false,
      approver01Name: 'approver01Name',
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
      useLateArrivalReason: false,
      useEarlyLeaveReason: false,
      reasonId: '',
      reasonName: '',
      reasonCode: '',
    }
  ),
  [STATUS.RECALLED]: createFromDefaultValue(
    CODE.Leave,
    {
      dailyRecord: null,
      nameMap: dummyRequestTypeMap,
    },
    {
      id: '000004',
      status: STATUS.RECALLED,
      requestTypeCode: CODE.Leave,
      requestTypeName: '休暇申請',
      leaveType: 'Paid',
      startDate: '2020-01-03',
      endDate: '2020-01-03',
      startTime: null,
      endTime: null,
      remarks: '',
      reason: '',
      leaveCode: null,
      leaveName: null,
      leaveRange: null,
      leaveDetailCode: null,
      leaveDetailName: null,
      substituteLeaveType: null,
      substituteDate: null,
      directApplyRestTimes: [],
      patternCode: null,
      patternName: null,
      patternRestTimes: [],
      originalRequestId: null,
      isForReapply: false,
      requireReason: false,
      approver01Name: 'approver01Name',
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
      useLateArrivalReason: false,
      useEarlyLeaveReason: false,
      reasonId: '',
      reasonName: '',
      reasonCode: '',
    }
  ),
  [`${STATUS.APPROVED}-Paid`]: createFromDefaultValue(
    CODE.Leave,
    {
      dailyRecord: null,
      nameMap: dummyRequestTypeMap,
    },
    {
      id: '000005',
      status: STATUS.APPROVED,
      requestTypeCode: CODE.Leave,
      requestTypeName: '休暇申請',
      leaveName: '有給休暇',
      leaveType: 'Paid',
      leaveRange: 'Day',
      startDate: '2020-01-04',
      endDate: '2020-01-04',
      startTime: null,
      endTime: null,
      remarks: '',
      reason: '',
      leaveCode: null,
      leaveDetailCode: null,
      leaveDetailName: null,
      substituteLeaveType: null,
      substituteDate: null,
      directApplyRestTimes: [],
      patternCode: null,
      patternName: null,
      patternRestTimes: [],
      originalRequestId: null,
      isForReapply: false,
      requireReason: false,
      approver01Name: 'approver01Name',
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
      useLateArrivalReason: false,
      useEarlyLeaveReason: false,
      reasonId: '',
      reasonName: '',
      reasonCode: '',
    }
  ),
  [`${STATUS.APPROVED}-Unpaid`]: createFromDefaultValue(
    CODE.Leave,
    {
      dailyRecord: null,
      nameMap: dummyRequestTypeMap,
    },
    {
      id: '000006',
      status: STATUS.APPROVED,
      requestTypeCode: CODE.Leave,
      requestTypeName: '休暇申請',
      leaveName: '無給休暇',
      leaveType: 'Unpaid',
      leaveRange: 'Day',
      leaveDetailCode: 'leaveDetail',
      leaveDetailName: '休暇内訳',
      startDate: '2020-01-05',
      endDate: '2020-01-05',
      startTime: null,
      endTime: null,
      remarks: '',
      reason: '',
      leaveCode: null,
      substituteLeaveType: null,
      substituteDate: null,
      directApplyRestTimes: [],
      patternCode: null,
      patternName: null,
      patternRestTimes: [],
      originalRequestId: null,
      isForReapply: false,
      requireReason: false,
      approver01Name: 'approver01Name',
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
      useLateArrivalReason: false,
      useEarlyLeaveReason: false,
      reasonId: '',
      reasonName: '',
      reasonCode: '',
    }
  ),
};

export default dummyRequestsMap;
