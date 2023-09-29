import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import { State } from '../../leaveRequest';

const leaveRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Leave',
    requestTypeName: '休暇',
    status: 'NotRequested',
    startDate: '2020-04-07',
    endDate: '2020-04-07',
    startTime: null,
    endTime: null,
    remarks: '',
    reason: '',
    leaveName: '年次有給休暇',
    leaveCode: 'annualPaidLeave',
    leaveType: 'Annual',
    leaveRange: 'Day',
    leaveDetailCode: 'leaveDetail',
    leaveDetailName: '休暇内訳',
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: null,
    patternName: null,
    patternRestTimes: [],
    requireReason: false,
    approver01Name: '',
    type: 'Leave',
    personalReason: false,
    useManagePersonalReason: false,
    workSystem: null,
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
    leaves: createMapByCode([
      {
        name: '年次有給休暇',
        code: 'annualPaidLeave',
        type: 'Annual',
        ranges: ['Day'],
        details: null,
        daysLeft: 0,
        hoursLeft: 0,
        timeLeaveDaysLeft: null,
        timeLeaveHoursLeft: null,
        requireReason: false,
      },
      {
        name: '有給休暇',
        code: 'paidLeave',
        type: 'Paid',
        ranges: ['Day'],
        details: null,
        daysLeft: null,
        hoursLeft: null,
        timeLeaveDaysLeft: null,
        timeLeaveHoursLeft: null,
        requireReason: false,
      },
      {
        name: '代休',
        code: 'tswsp_Compensatory',
        type: 'Compensatory',
        ranges: ['Day'],
        details: null,
        daysLeft: 0,
        hoursLeft: 0,
        timeLeaveDaysLeft: null,
        timeLeaveHoursLeft: null,
        requireReason: false,
      },
      {
        name: '無給休暇',
        code: 'unPaidLeave',
        type: 'Unpaid',
        ranges: ['Day'],
        details: null,
        daysLeft: null,
        hoursLeft: null,
        timeLeaveDaysLeft: null,
        timeLeaveHoursLeft: null,
        requireReason: false,
      },
    ]),
  },
  hasRange: false,
};
export default leaveRequest;
