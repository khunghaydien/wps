import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import TimesheetFactory from '../TimesheetFactory';
import { allDummyValue } from './mocks/DailyRecordViewModel.mock';

describe('create()', () => {
  const $allDummyValue = {
    ...allDummyValue,
    validationErrors: null,
    serverErrors: null,
    errors: [],
  };
  it('should convert', () => {
    // Arrange
    const records = [
      { ...$allDummyValue, recordDate: 'recordDate1' },
      { ...$allDummyValue, recordDate: 'recordDate2' },
    ];

    // Act
    const result = TimesheetFactory.create({
      employeeId: 'employeeId',
      records,
    });

    // Assert
    expect(result.employeeId).toEqual('employeeId');
    expect(result.startDate).toEqual('recordDate1');
    expect(result.endDate).toEqual('recordDate2');
    expect(result.records.length).toBe(2);
    expect(result.records[0]).toEqual({
      id: '',
      recordDate: 'recordDate1',
      startTime: 'startTime',
      endTime: 'endTime',
      restTimes: [
        {
          startTime: 'rest1StartTime',
          endTime: 'rest1EndTime',
          restReason: {
            id: '',
            code: 'rest1ReasonCode',
            name: '',
          },
        },
        {
          startTime: 'rest2StartTime',
          endTime: 'rest2EndTime',
          restReason: {
            id: '',
            code: 'rest2ReasonCode',
            name: '',
          },
        },
      ],
      requests: [
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.Leave,
          startDate: 'recordDate1',
          endDate: 'recordDate1',
          startTime: 'leaveRequest1StartTime',
          endTime: 'leaveRequest1EndTime',
          leaveCode: 'leaveRequest1Code',
          leaveName: '',
          leaveType: null,
          leaveRange: [
            'leaveRequest1Range',
            'leaveRequest2Range',
            'leaveRequest3Range',
          ],
          remarks: 'leaveRequest1Remark',
          reason: 'leaveRequest1Reason',
          requireReason: false,
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.OvertimeWork,
          targetDate: 'recordDate1',
          startTime: 'overtimeWorkRequestStartTime',
          endTime: 'overtimeWorkRequestEndTime',
          remarks: 'overtimeWorkRequestRemark',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.EarlyStartWork,
          targetDate: 'recordDate1',
          startTime: 'earlyStartWorkRequestStartTime',
          endTime: 'earlyStartWorkRequestEndTime',
          remarks: 'earlyStartWorkRequestRemark',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.EarlyLeave,
          targetDate: 'recordDate1',
          startTime: null,
          endTime: null,
          reasonText: 'earlyLeaveRequestReasonText',
          reasonCode: 'earlyLeaveRequestReasonCode',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.LateArrival,
          targetDate: 'recordDate1',
          startTime: null,
          endTime: null,
          reasonText: 'lateArrivalRequestReasonText',
          reasonCode: 'lateArrivalRequestReasonCode',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.HolidayWork,
          targetDate: 'recordDate1',
          startTime: 'holidayWorkRequestStartTime',
          endTime: 'holidayWorkRequestEndTime',
          substituteLeaveType: 'holidayWorkRequestSubstituteLeaveType',
          substituteDate: null,
          reason: null,
          remark: 'holidayWorkRequestRemark',
        },
      ],
      comment: 'comment',
    });
    expect(result.records[1]).toEqual({
      id: '',
      recordDate: 'recordDate2',
      startTime: 'startTime',
      endTime: 'endTime',
      restTimes: [
        {
          startTime: 'rest1StartTime',
          endTime: 'rest1EndTime',
          restReason: {
            id: '',
            code: 'rest1ReasonCode',
            name: '',
          },
        },
        {
          startTime: 'rest2StartTime',
          endTime: 'rest2EndTime',
          restReason: {
            id: '',
            code: 'rest2ReasonCode',
            name: '',
          },
        },
      ],
      requests: [
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.Leave,
          startDate: 'recordDate2',
          endDate: 'recordDate2',
          startTime: 'leaveRequest1StartTime',
          endTime: 'leaveRequest1EndTime',
          leaveCode: 'leaveRequest1Code',
          leaveName: '',
          leaveType: null,
          leaveRange: [
            'leaveRequest1Range',
            'leaveRequest2Range',
            'leaveRequest3Range',
          ],
          remarks: 'leaveRequest1Remark',
          reason: 'leaveRequest1Reason',
          requireReason: false,
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.OvertimeWork,
          targetDate: 'recordDate2',
          startTime: 'overtimeWorkRequestStartTime',
          endTime: 'overtimeWorkRequestEndTime',
          remarks: 'overtimeWorkRequestRemark',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.EarlyStartWork,
          targetDate: 'recordDate2',
          startTime: 'earlyStartWorkRequestStartTime',
          endTime: 'earlyStartWorkRequestEndTime',
          remarks: 'earlyStartWorkRequestRemark',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.EarlyLeave,
          targetDate: 'recordDate2',
          startTime: null,
          endTime: null,
          reasonText: 'earlyLeaveRequestReasonText',
          reasonCode: 'earlyLeaveRequestReasonCode',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.LateArrival,
          targetDate: 'recordDate2',
          startTime: null,
          endTime: null,
          reasonText: 'lateArrivalRequestReasonText',
          reasonCode: 'lateArrivalRequestReasonCode',
        },
        {
          id: null,
          requestTypeName: null,
          status: null,
          type: CODE.HolidayWork,
          targetDate: 'recordDate2',
          startTime: 'holidayWorkRequestStartTime',
          endTime: 'holidayWorkRequestEndTime',
          substituteLeaveType: 'holidayWorkRequestSubstituteLeaveType',
          substituteDate: null,
          reason: null,
          remark: 'holidayWorkRequestRemark',
        },
      ],
      comment: 'comment',
    });
  });
  it('should skip it has error', () => {
    // Arrange
    const records = [
      {
        ...$allDummyValue,
        errors: ['error1'],
      },
    ];

    // Act
    const result = TimesheetFactory.create({
      employeeId: 'employeeId',
      records,
    });

    // Assert
    expect(result.startDate).toBe(null);
    expect(result.endDate).toBe(null);
    expect(result.records.length).toBe(0);
  });
  it('should skip if checked is false', () => {
    // Arrange
    const records = [
      {
        ...$allDummyValue,
        checked: false,
      },
    ];

    // Act
    const result = TimesheetFactory.create({
      employeeId: 'employeeId',
      records,
    });

    // Assert
    expect(result.records.length).toBe(0);
  });
  describe('restTimes', () => {
    it.each`
      rest1StartTime | rest1EndTime | rest2StartTime | rest2EndTime | length
      ${null}        | ${null}      | ${null}        | ${null}      | ${0}
      ${null}        | ${null}      | ${null}        | ${0}         | ${0}
      ${null}        | ${null}      | ${0}           | ${null}      | ${0}
      ${null}        | ${null}      | ${0}           | ${0}         | ${1}
      ${null}        | ${0}         | ${null}        | ${null}      | ${0}
      ${null}        | ${0}         | ${null}        | ${0}         | ${0}
      ${null}        | ${0}         | ${0}           | ${null}      | ${0}
      ${null}        | ${0}         | ${0}           | ${0}         | ${1}
      ${0}           | ${null}      | ${null}        | ${null}      | ${0}
      ${0}           | ${null}      | ${null}        | ${0}         | ${0}
      ${0}           | ${null}      | ${0}           | ${null}      | ${0}
      ${0}           | ${null}      | ${0}           | ${0}         | ${1}
      ${0}           | ${0}         | ${null}        | ${null}      | ${1}
      ${0}           | ${0}         | ${null}        | ${0}         | ${1}
      ${0}           | ${0}         | ${0}           | ${null}      | ${1}
      ${0}           | ${0}         | ${0}           | ${0}         | ${2}
    `(
      'should be $length length when [rest1StartTime=$rest1StartTime, rest1EndTime=$rest1EndTime, rest2StartTime=$rest2StartTime, rest2EndTime=$rest2EndTime]',
      ({ length, ...param }) => {
        // Arrange
        const records = [
          {
            ...$allDummyValue,
            ...param,
          },
        ];

        // Act
        const result = TimesheetFactory.create({
          employeeId: 'employeeId',
          records,
        });

        // Assert
        expect(result.records[0].restTimes.length).toBe(length);
      }
    );
  });
  describe('requests', () => {
    it('should skip leaveRequest if appliedLeaveRequest1 is false', () => {
      // Arrange
      const records = [
        {
          ...$allDummyValue,
          appliedLeaveRequest1: false,
        },
      ];

      // Act
      const result = TimesheetFactory.create({
        employeeId: 'employeeId',
        records,
      });

      // Assert
      expect(
        result.records[0].requests.every(({ type }) => type !== CODE.Leave)
      ).toBe(true);
    });
    it('should skip overtimeWorkRequest if appliedOvertimeWorkRequest is false', () => {
      // Arrange
      const records = [
        {
          ...$allDummyValue,
          appliedOvertimeWorkRequest: false,
        },
      ];

      // Act
      const result = TimesheetFactory.create({
        employeeId: 'employeeId',
        records,
      });

      // Assert
      expect(
        result.records[0].requests.every(
          ({ type }) => type !== CODE.OvertimeWork
        )
      ).toBe(true);
    });
    it('should skip earlyStartWorkRequest if appliedEarlyStartWorkRequest is false', () => {
      // Arrange
      const records = [
        {
          ...$allDummyValue,
          appliedEarlyStartWorkRequest: false,
        },
      ];

      // Act
      const result = TimesheetFactory.create({
        employeeId: 'employeeId',
        records,
      });

      // Assert
      expect(
        result.records[0].requests.every(
          ({ type }) => type !== CODE.EarlyStartWork
        )
      ).toBe(true);
    });
  });
});
