import { State } from '../../earlyStartWorkRequest';

const earlyStartWorkRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'EarlyStartWork',
    requestTypeName: '早朝勤務',
    status: 'NotRequested',
    startDate: '2020-04-06',
    endDate: '',
    startTime: null,
    endTime: 540,
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
    type: 'EarlyStartWork',
  },
};

export default earlyStartWorkRequest;
