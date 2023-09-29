import * as DailyRecordViewModel from '../..';

const original = jest.requireActual('../..');

export const defaultValues: DailyRecordViewModel.DailyRecordViewModel[] = [
  original.create({
    checked: false,
    recordId: '1',
    recordDate: '2022-12-01',
    startTime: 540,
    endTime: 1080,
    loadingRestTimeReasons: false,
    restTimeReasons: null,
    rest1StartTime: 720,
    rest1EndTime: 780,
    rest1Reason: null,
    rest1ReasonCode: null,
    rest2StartTime: null,
    rest2EndTime: null,
    rest2Reason: null,
    rest2ReasonCode: null,
  }),
  original.create({
    checked: false,
    recordId: '2',
    recordDate: '2022-12-02',
    startTime: 540,
    endTime: 1080,
    loadingRestTimeReasons: false,
    restTimeReasons: null,
    rest1StartTime: 720,
    rest1EndTime: 780,
    rest1Reason: null,
    rest1ReasonCode: null,
    rest2StartTime: null,
    rest2EndTime: null,
    rest2Reason: null,
    rest2ReasonCode: null,
  }),
  original.create({
    checked: false,
    recordId: '3',
    recordDate: '2022-12-03',
    startTime: 540,
    endTime: 1080,
    loadingRestTimeReasons: false,
    restTimeReasons: null,
    rest1StartTime: 720,
    rest1EndTime: 780,
    rest1Reason: null,
    rest1ReasonCode: null,
    rest2StartTime: null,
    rest2EndTime: null,
    rest2Reason: null,
    rest2ReasonCode: null,
  }),
];

const $allDummyValue: DailyRecordViewModel.DailyRecordViewModel = {
  checked: true,
  recordId: 'recordId',
  recordDate: 'recordDate',
  startTime: 'startTime',
  endTime: 'endTime',

  loadingRestTimeReasons: false,
  restTimeReasons: ['restTimeReason1', 'restTimeReason2', 'restTimeReason3'],
  rest1StartTime: 'rest1StartTime',
  rest1EndTime: 'rest1EndTime',
  rest1Reason: 'rest1Reason',
  rest1ReasonCode: 'rest1ReasonCode',
  rest2StartTime: 'rest2StartTime',
  rest2EndTime: 'rest2EndTime',
  rest2Reason: 'rest2Reason',
  rest2ReasonCode: 'rest2ReasonCode',

  // 休暇申請
  loadingLeaveRequestLeaves: false,
  leaveRequestLeaves: [
    'leaveRequestLeaves1',
    'leaveRequestLeaves2',
    'leaveRequestLeaves3',
  ],
  appliedLeaveRequest1: true,
  leaveRequest1Leave: 'leaveRequest1Leave',
  leaveRequest1Code: 'leaveRequest1Code',
  leaveRequest1Range: [
    'leaveRequest1Range',
    'leaveRequest2Range',
    'leaveRequest3Range',
  ],
  leaveRequest1StartTime: 'leaveRequest1StartTime',
  leaveRequest1EndTime: 'leaveRequest1EndTime',
  leaveRequest1Reason: 'leaveRequest1Reason',
  leaveRequest1Remark: 'leaveRequest1Remark',

  // 残業申請
  appliedOvertimeWorkRequest: true,
  overtimeWorkRequestStartTime: 'overtimeWorkRequestStartTime',
  overtimeWorkRequestEndTime: 'overtimeWorkRequestEndTime',
  overtimeWorkRequestRemark: 'overtimeWorkRequestRemark',

  // 早朝勤務申請
  appliedEarlyStartWorkRequest: true,
  earlyStartWorkRequestStartTime: 'earlyStartWorkRequestStartTime',
  earlyStartWorkRequestEndTime: 'earlyStartWorkRequestEndTime',
  earlyStartWorkRequestRemark: 'earlyStartWorkRequestRemark',

  // 遅刻申請
  loadingLateArrivalRequestReasons: false,
  lateArrivalReasons: [
    'lateArrivalReasons1',
    'lateArrivalReasons2',
    'lateArrivalReasons3',
  ],
  appliedLateArrivalRequest: true,
  lateArrivalRequestReasonText: 'lateArrivalRequestReasonText',
  lateArrivalRequestReasonCode: 'lateArrivalRequestReasonCode',

  // 早退申請
  loadingEarlyLeaveRequestReasons: false,
  earlyLeaveReasons: [
    'earlyLeaveReasons1',
    'earlyLeaveReasons2',
    'earlyLeaveReasons3',
  ],
  appliedEarlyLeaveRequest: true,
  earlyLeaveRequestReasonText: 'earlyLeaveRequestReasonText',
  earlyLeaveRequestReasonCode: 'earlyLeaveRequestReasonCode',

  // 欠勤申請
  appliedAbsenceRequest: true,
  absenceRequestReason: 'absenceRequestReason',

  // 休日出勤申請
  appliedHolidayWorkRequest: true,
  holidayWorkRequestSubstituteLeaveType:
    'holidayWorkRequestSubstituteLeaveType',
  holidayWorkRequestStartTime: 'holidayWorkRequestStartTime',
  holidayWorkRequestEndTime: 'holidayWorkRequestEndTime',
  holidayWorkRequestRemark: 'holidayWorkRequestRemark',

  validationErrors: new Map([['field', ['validationError1']]]),
  serverErrors: ['serverError1'],

  errors: ['error1'],
  comment: 'comment',
} as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in keyof DailyRecordViewModel.DailyRecordViewModel]: any;
};

export const allDummyValue =
  $allDummyValue as unknown as DailyRecordViewModel.DailyRecordViewModel;
