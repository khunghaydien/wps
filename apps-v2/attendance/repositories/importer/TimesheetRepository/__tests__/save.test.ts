import { allDummyValue } from '@attendance/domain/models/importer/__tests__/mocks/Timesheet.mock';

import Api from '../../../../../../__tests__/mocks/ApiMock';
import save from '../save';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should convert', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await save(allDummyValue);

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/timesheet-import/save',
    param: {
      empId: 'employeeId',
      importRecords: [
        {
          targetDate: 'recordDate',
          startTime: 'startTime',
          endTime: 'endTime',
          rest1StartTime: 'rest1StartTime',
          rest1EndTime: 'rest1EndTime',
          rest1ReasonCode: 'rest1ReasonCode',
          rest2StartTime: 'rest2StartTime',
          rest2EndTime: 'rest2EndTime',
          rest2ReasonCode: 'rest2ReasonCode',
          // 休暇申請1
          useLeave1: true,
          leave1Code: 'leaveRequest1LeaveCode',
          leave1Range: 'leaveRequest1LeaveRange',
          leave1StartTime: 'leaveRequest1StartTime',
          leave1EndTime: 'leaveRequest1EndTime',
          leave1Reason: 'leaveRequest1Reason',
          leave1Remarks: 'leaveRequest1Remarks',
          // 残業申請
          useOvertimeWork: true,
          overtimeWorkStartTime: 'overtimeWorkRequestStartTime',
          overtimeWorkEndTime: 'overtimeWorkRequestEndTime',
          overtimeWorkRemarks: 'overtimeWorkRequestRemarks',
          // 早朝勤務申請
          useEarlyStartWork: true,
          earlyStartWorkStartTime: 'earlyStartWorkRequestStartTime',
          earlyStartWorkEndTime: 'earlyStartWorkRequestEndTime',
          earlyStartWorkRemarks: 'earlyStartWorkRequestRemarks',
          // 遅刻申請
          useEarlyLeave: true,
          earlyLeaveReason: 'earlyLeaveRequestReasonText',
          earlyLeaveReasonCode: 'earlyLeaveRequestReasonCode',
          // 早退申請
          useLateArrival: true,
          lateArrivalReason: 'lateArrivalRequestReasonText',
          lateArrivalReasonCode: 'lateArrivalRequestReasonCode',
          // 休日出勤
          useHolidayWork: true,
          holidayWorkStartTime: 'holidayWorkRequestStartTime',
          holidayWorkEndTime: 'holidayWorkRequestEndTime',
          holidayWorkSubstituteLeaveType:
            'holidayWorkRequestSubstituteLeaveType',
          holidayWorkRemarks: 'holidayWorkRequestRemark',
        },
      ],
    },
  });
});

it('should convert if array is null', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await save({
    ...allDummyValue,
    records: [
      {
        ...allDummyValue.records[0],
        restTimes: null,
        requests: null,
      },
    ],
  });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/timesheet-import/save',
    param: {
      empId: 'employeeId',
      importRecords: [
        {
          targetDate: 'recordDate',
          startTime: 'startTime',
          endTime: 'endTime',
          rest1StartTime: null,
          rest1EndTime: null,
          rest1ReasonCode: '',
          rest2StartTime: null,
          rest2EndTime: null,
          rest2ReasonCode: '',
          // 休暇申請1
          useLeave1: false,
          leave1Code: '',
          leave1Range: null,
          leave1StartTime: null,
          leave1EndTime: null,
          leave1Reason: '',
          leave1Remarks: '',
          // 残業申請
          useOvertimeWork: false,
          overtimeWorkStartTime: null,
          overtimeWorkEndTime: null,
          overtimeWorkRemarks: '',
          // 早朝勤務申請
          useEarlyStartWork: false,
          earlyStartWorkStartTime: null,
          earlyStartWorkEndTime: null,
          earlyStartWorkRemarks: '',
          // 遅刻申請
          useEarlyLeave: false,
          earlyLeaveReason: null,
          earlyLeaveReasonCode: null,
          // 早退申請
          useLateArrival: false,
          lateArrivalReason: null,
          lateArrivalReasonCode: null,
          // 休日出勤
          useHolidayWork: false,
          holidayWorkStartTime: null,
          holidayWorkEndTime: null,
          holidayWorkSubstituteLeaveType: null,
          holidayWorkRemarks: null,
        },
      ],
    },
  });
});
