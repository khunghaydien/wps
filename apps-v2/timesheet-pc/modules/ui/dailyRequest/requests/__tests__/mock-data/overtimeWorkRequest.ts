import { State } from '../../overtimeWorkRequest';

const overtimeWorkRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'OvertimeWork',
    requestTypeName: '残業',
    status: 'NotRequested',
    startDate: '2020-04-07',
    endDate: '',
    startTime: 1080,
    endTime: null,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
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
    type: 'OvertimeWork',
  },
};

export default overtimeWorkRequest;
