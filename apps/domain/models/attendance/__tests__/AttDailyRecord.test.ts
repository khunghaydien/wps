import REQUEST_STATUS from '../../approval/request/Status';
import {
  // eslint-disable-next-line
  // @ts-ignore
  __get__,
  AttDailyRecord,
  DAY_TYPE,
  hasInsufficientRestTime,
  isRealEndTimeOnEffectiveWorkingTime,
  isRealStartTimeOnEffectiveWorkingTime,
  isRealWorkingTimeOnEffectiveWorkingTime,
} from '../AttDailyRecord';
import { AttDailyRequest } from '../AttDailyRequest';
import { CODE as REQUEST_TYPE_CODE } from '../AttDailyRequestType';
import { LEAVE_RANGE } from '../LeaveRange';

const startDate = '2018-10-01';

const shouldInput = (param) =>
  __get__('shouldInputByParam')({
    recordDate: startDate,
    ...param,
  });

const canEdit = (param) => __get__('canEditByParam')(param);

const createRequestBase = (params: {
  requestTypeCode?: AttDailyRequest['requestTypeCode'];
  status?: AttDailyRequest['status'];
  leaveRange?: AttDailyRequest['leaveRange'];
  substituteLeaveType?: AttDailyRequest['substituteLeaveType'];
  substituteDate?: AttDailyRequest['substituteDate'];
  originalRequestId?: AttDailyRequest['originalRequestId'];
  isForReapply?: AttDailyRequest['isForReapply'];
  startDate?: AttDailyRequest['startDate'];
}): AttDailyRecord => ({
  id: 'a',
  requestTypeCode: null,
  status: null,
  startDate: null,
  // @ts-ignore
  endDate: startDate,
  startTime: null,
  endTime: null,
  remarks: '',
  leaveName: null,
  leaveType: null,
  leaveRange: null,
  substituteLeaveType: null,
  substituteDate: null,
  originalRequestId: null,
  isForReapply: false,
  directApplyRestTimes: [],
  approver01Name: '',
  ...params,
});

const createLeaveRequest = (params: {
  leaveRange: AttDailyRequest['leaveRange'];
  substituteLeaveType?: AttDailyRequest['substituteLeaveType'];
  substituteDate?: AttDailyRequest['substituteDate'];
  originalRequestId?: AttDailyRequest['originalRequestId'];
  isForReapply?: AttDailyRequest['isForReapply'];
}) =>
  createRequestBase({
    requestTypeCode: REQUEST_TYPE_CODE.Leave,
    ...params,
  });

const createHolidayWorkRequest = (params: {
  startDate?: AttDailyRequest['startDate'];
  substituteDate: AttDailyRequest['substituteDate'];
}) =>
  createRequestBase({
    requestTypeCode: REQUEST_TYPE_CODE.HolidayWork,
    ...params,
  });

const createAbsenceRequest = () =>
  createRequestBase({
    requestTypeCode: REQUEST_TYPE_CODE.Absence,
  });

const createDirectRequest = () =>
  createRequestBase({
    requestTypeCode: REQUEST_TYPE_CODE.Direct,
  });

describe('domain/models/attendance/AttDailyRecord', () => {
  describe('shouldInputByParam', () => {
    describe('Has request', () => {
      test.each([
        [
          DAY_TYPE.Workday,
          createLeaveRequest({
            leaveRange: LEAVE_RANGE.Day,
          }),
          {
            ApprovalIn: false,
            Approved: false,
            Rejected: false,
            Recalled: false,
            Canceled: false,
            Reapplying: true,
          },
        ],
        [
          DAY_TYPE.Workday,
          createLeaveRequest({
            leaveRange: LEAVE_RANGE.AM,
          }),
          {
            ApprovalIn: true,
            Approved: true,
            Rejected: true,
            Recalled: true,
            Canceled: true,
            Reapplying: true,
          },
        ],
        [
          DAY_TYPE.Workday,
          createHolidayWorkRequest({
            substituteDate: startDate,
          }),
          {
            ApprovalIn: false,
            Approved: false,
            Rejected: false,
            Recalled: false,
            Canceled: false,
            Reapplying: true,
          },
        ],
        [
          DAY_TYPE.Workday,
          createHolidayWorkRequest({
            substituteDate: '2018-11-01',
          }),
          {
            ApprovalIn: true,
            Approved: true,
            Rejected: true,
            Recalled: true,
            Canceled: true,
            Reapplying: true,
          },
        ],
        [
          DAY_TYPE.Workday,
          createAbsenceRequest(),
          {
            ApprovalIn: false,
            Approved: false,
            Rejected: false,
            Recalled: false,
            Canceled: false,
            Reapplying: true,
          },
        ],
        [
          DAY_TYPE.Workday,
          createDirectRequest(),
          {
            ApprovalIn: false,
            Approved: true,
            Rejected: true,
            Recalled: true,
            Canceled: true,
            Reapplying: true,
          },
        ],
        [
          DAY_TYPE.Holiday,
          createHolidayWorkRequest({
            startDate,
            substituteDate: '2018-11-01',
          }),
          {
            ApprovalIn: false,
            Approved: true,
            Rejected: false,
            Recalled: false,
            Canceled: false,
            Reapplying: false,
          },
        ],
        [
          DAY_TYPE.LegalHoliday,
          createHolidayWorkRequest({
            startDate,
            substituteDate: '2018-11-01',
          }),
          {
            ApprovalIn: false,
            Approved: true,
            Rejected: false,
            Recalled: false,
            Canceled: false,
            Reapplying: false,
          },
        ],
        [
          DAY_TYPE.Holiday,
          createHolidayWorkRequest({
            startDate: '2018-11-01',
            substituteDate: startDate,
          }),
          {
            ApprovalIn: false,
            Approved: false,
            Rejected: false,
            Recalled: false,
            Canceled: false,
            Reapplying: false,
          },
        ],
      ])('%s\n%o\n%o', (dayType, request, results) => {
        Object.keys(results).forEach((key) => {
          expect(
            shouldInput({
              dayType,
              requests: [
                {
                  ...request,
                  status: REQUEST_STATUS[key],
                },
              ],
            })
          ).toBe(results[key]);
        });
      });
    });

    describe('No request', () => {
      test.each([
        [DAY_TYPE.Workday, true],
        [DAY_TYPE.Holiday, false],
        [DAY_TYPE.LegalHoliday, false],
      ])('%s: %p', (dayType, result) => {
        expect(shouldInput({ dayType, requests: [] })).toBe(result);
      });
    });

    describe('isLeaveOfAbsence', () => {
      it.each`
        isLeaveOfAbsence | requestTypeCode                 | requestStatus                  | expected
        ${false}         | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.Approved}     | ${true}
        ${false}         | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.ApprovalIn}   | ${false}
        ${false}         | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.NotRequested} | ${true}
        ${false}         | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.Rejected}     | ${true}
        ${false}         | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.Recalled}     | ${true}
        ${false}         | ${REQUEST_TYPE_CODE.EarlyLeave} | ${REQUEST_STATUS.Approved}     | ${true}
        ${true}          | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.Approved}     | ${true}
        ${true}          | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.ApprovalIn}   | ${false}
        ${true}          | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.NotRequested} | ${false}
        ${true}          | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.Rejected}     | ${false}
        ${true}          | ${REQUEST_TYPE_CODE.Direct}     | ${REQUEST_STATUS.Recalled}     | ${false}
        ${true}          | ${REQUEST_TYPE_CODE.EarlyLeave} | ${REQUEST_STATUS.Approved}     | ${false}
      `(
        'should be $expected when isLeaveOfAbsence=$isLeaveOfAbsence, requestTypeCode=$requestTypeCode, requestStatus=$requestStatus',
        ({ isLeaveOfAbsence, requestTypeCode, requestStatus, expected }) => {
          expect(
            shouldInput({
              dayType: DAY_TYPE.Workday,
              isLeaveOfAbsence,
              requests: [
                {
                  requestTypeCode,
                  status: requestStatus,
                },
              ],
            } as unknown as Parameters<typeof shouldInput>[0])
          ).toBe(expected);
        }
      );
    });
  });

  describe('canEdit', () => {
    test('isLocked', () => {
      expect(
        canEdit({
          isLocked: true,
          startTime: null,
          endTime: null,
          shouldInputResult: true,
        })
      ).toBe(false);
    });
    test('Has startTime and endTime', () => {
      expect(
        canEdit({
          isLocked: false,
          startTime: 0,
          endTime: null,
          shouldInputResult: true,
        })
      ).toBe(true);
      expect(
        canEdit({
          isLocked: false,
          startTime: null,
          endTime: 0,
          shouldInputResult: true,
        })
      ).toBe(true);
    });

    test('shouldInput', () => {
      expect(
        canEdit({
          isLocked: false,
          startTime: null,
          endTime: null,
          shouldInputResult: true,
        })
      ).toBe(true);
      expect(
        canEdit({
          isLocked: false,
          startTime: null,
          endTime: null,
          shouldInputResult: false,
        })
      ).toBe(false);
    });
  });

  test.each([
    [
      'あり',
      {
        insufficientRestTime: 0,
        startTime: null,
        endTime: null,
        outStartTime: null,
        outEndTime: null,
      },
      false,
    ],
    [
      'なし',
      {
        insufficientRestTime: 5,
        startTime: null,
        endTime: null,
        outStartTime: null,
        outEndTime: null,
      },
      true,
    ],
  ])('hasInsufficientRestTime %s', (name, record, result) => {
    expect(hasInsufficientRestTime(record)).toEqual(result);
  });

  test.each([
    [
      '時間外で出退勤',
      {
        startTime: 0,
        endTime: 1 * 60,
        outStartTime: 0,
        outEndTime: 0,
      },
      [false, true, false],
    ],
    [
      '出勤が時間外',
      {
        startTime: 0,
        endTime: 2 * 60,
        outStartTime: 1 * 60,
        outEndTime: 2 * 60,
      },
      [true, false, true],
    ],
    [
      '退勤が時間外',
      {
        startTime: 0,
        endTime: 2 * 60,
        outStartTime: 0,
        outEndTime: 1 * 60,
      },
      [true, true, false],
    ],
    [
      '時間内で働いた時間が有るが出退勤時間が時間外',
      {
        startTime: 0,
        endTime: 3 * 60,
        outStartTime: 1 * 60,
        outEndTime: 2 * 60,
      },
      [true, false, false],
    ],
  ])('勤務時間外 %s', (name, record, results) => {
    expect(isRealWorkingTimeOnEffectiveWorkingTime(record)).toEqual(results[0]);
    expect(isRealStartTimeOnEffectiveWorkingTime(record)).toEqual(results[1]);
    expect(isRealEndTimeOnEffectiveWorkingTime(record)).toEqual(results[2]);
  });
});
