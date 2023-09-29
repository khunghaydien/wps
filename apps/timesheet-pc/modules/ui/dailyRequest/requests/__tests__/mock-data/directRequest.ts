import { State } from '../../directRequest';

const directRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Direct',
    requestTypeName: '直行直帰',
    status: 'NotRequested',
    startDate: '2020-04-06',
    endDate: '2020-04-06',
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
    directApplyRestTimes: [
      {
        startTime: null,
        endTime: null,
      },
      {
        startTime: null,
        endTime: null,
      },
      {
        startTime: null,
        endTime: null,
      },
    ],
    patternCode: null,
    patternName: null,
    patternRestTimes: [],
    requireReason: false,
    approver01Name: '',
    type: 'Direct',
  },
  hasRange: false,
};

export default directRequest;
