import { State } from '../../lateArrivalRequest';

const lateArrivalRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'LateArrival',
    requestTypeName: '遅刻',
    status: 'NotRequested',
    startDate: '2020-04-07',
    endDate: '',
    startTime: 540,
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
    type: 'LateArrival',
  },
};

export default lateArrivalRequest;
