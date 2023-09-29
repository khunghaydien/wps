import STATUS from '../../../../domain/models/approval/request/Status';
import { createFromDefaultValue } from '../../../../domain/models/attendance/AttDailyRequest';
import { CODE } from '../../../../domain/models/attendance/AttDailyRequestType';

const dummyRequestTypeMap = {
  [CODE.Leave]: {
    code: CODE.Leave,
    name: 'Leave',
  },
};

const dummyRequestsMap = {
  [STATUS.Rejected]: createFromDefaultValue(dummyRequestTypeMap, CODE.Leave, {
    id: '000001',
    status: STATUS.Rejected,
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
  }),
  [STATUS.ApprovalIn]: createFromDefaultValue(dummyRequestTypeMap, CODE.Leave, {
    id: '000002',
    status: STATUS.ApprovalIn,
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
  }),
  [STATUS.Approved]: createFromDefaultValue(dummyRequestTypeMap, CODE.Leave, {
    id: '000003',
    status: STATUS.Approved,
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
  }),
  [STATUS.Recalled]: createFromDefaultValue(dummyRequestTypeMap, CODE.Leave, {
    id: '000004',
    status: STATUS.Recalled,
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
  }),
  [`${STATUS.Approved}-Paid`]: createFromDefaultValue(
    dummyRequestTypeMap,
    CODE.Leave,
    {
      id: '000005',
      status: STATUS.Approved,
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
    }
  ),
  [`${STATUS.Approved}-Unpaid`]: createFromDefaultValue(
    dummyRequestTypeMap,
    CODE.Leave,
    {
      id: '000006',
      status: STATUS.Approved,
      requestTypeCode: CODE.Leave,
      requestTypeName: '休暇申請',
      leaveName: '無給休暇',
      leaveType: 'Unpaid',
      leaveRange: 'Day',
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
    }
  ),
};

export default dummyRequestsMap;