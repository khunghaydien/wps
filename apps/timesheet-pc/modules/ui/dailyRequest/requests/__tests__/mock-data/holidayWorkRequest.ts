import { State } from '../../holidayWorkRequest';

const holidayWorkRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'HolidayWork',
    requestTypeName: '休日出勤',
    status: 'NotRequested',
    startDate: '2020-04-05',
    endDate: '',
    startTime: 540,
    endTime: 1080,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    substituteLeaveType: 'None',
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: null,
    patternName: null,
    patternRestTimes: [],
    requireReason: false,
    approver01Name: '',
    type: 'HolidayWork',
  },
  substituteLeaveTypeList: ['None', 'CompensatoryStocked', 'Substitute'],
};

export default holidayWorkRequest;
