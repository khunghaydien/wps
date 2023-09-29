import { State } from '../../absenceRequest';

const absenceRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Absence',
    requestTypeName: '欠勤',
    status: 'NotRequested',
    startDate: '2020-02-07',
    endDate: '2020-02-07',
    startTime: null,
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
    type: 'Absence',
  },
  hasRange: false,
};

export default absenceRequest;
