import { AttDailyRequest } from '../../../../../../domain/models/attendance/AttDailyRequest';

const dailyRequest: AttDailyRequest = {
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
  type: 'Leave',
};

export default dailyRequest;
