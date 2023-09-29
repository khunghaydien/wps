import STATUS from '../../approval/request/Status';
import {
  createFromDefaultValue,
  DISABLE_ACTION,
  EDIT_ACTION,
  getAvailableRequestTypesAt,
  getLatestRequestsAt,
  getPerformableDisableAction,
  getPerformableEditAction,
  isForReapply,
} from '../AttDailyRequest';
import { defaultValue } from '../AttDailyRequest/BaseAttDailyRequest';
import { CODE, Code } from '../AttDailyRequestType';
import { LEAVE_RANGE } from '../LeaveRange';
import { createTimesheet } from './mocks/timesheet';

const createRequest = (request: { requestTypeCode: Code }) =>
  createFromDefaultValue(
    {
      [request.requestTypeCode]: {
        code: request.requestTypeCode,
        name: 'Request',
      },
    },
    request.requestTypeCode,
    {
      ...defaultValue,
      ...request,
    }
  );

describe('domain/models/attendance/AttDailyRequest', () => {
  describe('getAvaiableRequestTypesAt', () => {
    test('should return avaiable request types', () => {
      // Arrange
      const requestTypeCodes = [CODE.HolidayWork, CODE.OvertimeWork];
      const requestTypes = {
        [CODE.HolidayWork]: {
          code: CODE.HolidayWork,
          name: '休日出勤',
        },
        [CODE.OvertimeWork]: {
          code: CODE.OvertimeWork,
          name: '残業',
        },
        [CODE.EarlyStartWork]: {
          code: CODE.EarlyStartWork,
          name: '早朝勤務',
        },
        [CODE.LateArrival]: {
          code: CODE.LateArrival,
          name: '遅刻',
        },
      };
      // @ts-ignore
      const timesheet = createTimesheet({
        requestTypes,
      });
      const expected = {
        [CODE.HolidayWork]: {
          code: CODE.HolidayWork,
          name: '休日出勤',
        },
        [CODE.OvertimeWork]: {
          code: CODE.OvertimeWork,
          name: '残業',
        },
      };

      // Execute
      // @ts-ignore
      const actual = getAvailableRequestTypesAt(requestTypeCodes, timesheet);

      // Assert
      expect(actual).toEqual(expected);
    });

    test('when timesheet is locked, this method is return the empty object', () => {
      // Arrange
      const dailyRecord = {
        requestTypeCodes: [CODE.HolidayWork, CODE.OvertimeWork],
      };
      const requestTypes = {
        [CODE.HolidayWork]: {
          code: CODE.HolidayWork,
          name: '休日出勤',
        },
        [CODE.OvertimeWork]: {
          code: CODE.OvertimeWork,
          name: '残業',
        },
        [CODE.EarlyStartWork]: {
          code: CODE.EarlyStartWork,
          name: '早朝勤務',
        },
        [CODE.LateArrival]: {
          code: CODE.LateArrival,
          name: '遅刻',
        },
      };
      // @ts-ignore
      const timesheet = createTimesheet({
        requestTypes,
        isLocked: true,
      });

      const expected = {};

      // Execute
      // @ts-ignore
      const actual = getAvailableRequestTypesAt(dailyRecord, timesheet);

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  describe('getLatestRequestsAt', () => {
    describe('when timesheet is locked', () => {
      test('should return submitted requests excluding reapplying requests', () => {
        // Arrange
        const requestsById = {
          A: {
            id: 'A',
            originalRequestId: 'E',
            isForReapply: false,
          },
          B: {
            id: 'B',
            isForReapply: false,
          },
          C: {
            id: 'C',
            isForReapply: false,
          },
          D: {
            id: 'D',
            isForReapply: false,
          },
          E: {
            id: 'E',
            isForReapply: true,
          },
        };
        const timesheet = createTimesheet({
          // @ts-ignore
          requestsById,
          isLocked: true,
        });
        const expected = [
          {
            id: 'D',
            isForReapply: false,
          },
        ];

        // Execute
        const actual = getLatestRequestsAt(
          // @ts-ignore
          {
            requestIds: ['D', 'E'],
          },
          timesheet
        );

        // Assert
        expect(actual).toEqual(expected);
      });
    });
    describe('when timesheet is not locked', () => {
      test('should return submitted requests including reapplying requests', () => {
        // Arrange
        const requestsById = {
          A: {
            id: 'A',
            originalRequestId: 'E',
            isForReapply: true,
          },
          B: {
            id: 'B',
            isForReapply: false,
          },
          C: {
            id: 'C',
            isForReapply: false,
          },
          D: {
            id: 'D',
            isForReapply: true,
          },
          E: {
            id: 'E',
            isForReapply: false,
          },
        };
        const timesheet = createTimesheet({
          // @ts-ignore
          requestsById,
          isLocked: false,
        });
        const expected = [
          {
            id: 'D',
            isForReapply: true,
          },
          {
            id: 'A',
            originalRequestId: 'E',
            isForReapply: true,
          },
        ];

        // Execute
        const actual = getLatestRequestsAt(
          // @ts-ignore
          {
            requestIds: ['D', 'A', 'E'],
          },
          timesheet
        );

        // Assert
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('getPerformableEditAction', () => {
    test.each([
      [
        {
          status: STATUS.NotRequested,
        },
        EDIT_ACTION.Create,
      ],
      [
        {
          status: STATUS.ApprovalIn,
        },
        EDIT_ACTION.None,
      ],
      [
        {
          status: STATUS.Approved,
          requestTypeCode: CODE.HolidayWork,
        },
        EDIT_ACTION.Reapply,
      ],
      [
        {
          status: STATUS.Approved,
        },
        EDIT_ACTION.None,
      ],
      [
        {
          status: STATUS.Rejected,
        },
        EDIT_ACTION.Modify,
      ],
      [
        {
          status: STATUS.Recalled,
        },
        EDIT_ACTION.Modify,
      ],
      [
        {
          status: STATUS.Canceled,
        },
        EDIT_ACTION.Modify,
      ],
    ])('%o\n%s', (request, result) => {
      expect(
        // @ts-ignore
        getPerformableEditAction({
          ...defaultValue,
          ...request,
        })
      ).toBe(result);
    });
  });

  describe('getPerfomableDisableAction', () => {
    test.each([
      [
        {
          status: STATUS.NotRequested,
        },
        DISABLE_ACTION.None,
      ],
      [
        {
          status: STATUS.ApprovalIn,
        },
        DISABLE_ACTION.CancelRequest,
      ],
      [
        {
          status: STATUS.Approved,
        },
        DISABLE_ACTION.CancelApproval,
      ],
      [
        {
          status: STATUS.Rejected,
        },
        DISABLE_ACTION.Remove,
      ],
      [
        {
          status: STATUS.Recalled,
        },
        DISABLE_ACTION.Remove,
      ],
      [
        {
          status: STATUS.Canceled,
        },
        DISABLE_ACTION.Remove,
      ],
    ])('%o\n%s', (request, result) => {
      expect(
        // @ts-ignore
        getPerformableDisableAction({
          ...defaultValue,
          ...request,
        })
      ).toBe(result);
    });
  });

  describe('isForReapply', () => {
    const reapply = [CODE.HolidayWork, CODE.Leave];
    const notReapply = Object.keys(CODE).filter(
      // @ts-ignore
      (code) => code !== CODE.None && !reapply.includes(code)
    );
    const modify = [STATUS.Rejected, STATUS.Recalled, STATUS.Canceled];

    describe.each(notReapply)('%s', (code) => {
      test.each(Object.keys(STATUS))('status: %s', (status) => {
        const request = createRequest({
          // @ts-ignore
          requestTypeCode: code,
          // @ts-ignore
          status,
        });
        expect(isForReapply(request)).toBe(false);
      });
    });

    describe('HolidayWork', () => {
      test.each(Object.keys(STATUS))('status: %s', (status) => {
        const request = createRequest({
          requestTypeCode: CODE.HolidayWork,
          // @ts-ignore
          status,
        });
        if (status === STATUS.Approved) {
          expect(isForReapply(request)).toBe(true);
        } else {
          expect(isForReapply(request)).toBe(false);
        }
      });
      describe('isForReapply', () => {
        test.each(Object.keys(STATUS))('status: %s', (status) => {
          if (STATUS.Approved === status) {
            return;
          }
          const request = createRequest({
            requestTypeCode: CODE.HolidayWork,
            // @ts-ignore
            isForReapply: true,
            status,
          });
          // @ts-ignore
          if (modify.includes(status)) {
            expect(isForReapply(request)).toBe(true);
          } else {
            expect(isForReapply(request)).toBe(false);
          }
        });
      });
    });

    describe('LeaveRequest', () => {
      test.each(Object.keys(LEAVE_RANGE))('leaveRange: %s', (leaveRange) => {
        const request = createRequest({
          requestTypeCode: CODE.Leave,
          // @ts-ignore
          status: STATUS.Approved,
          leaveRange,
        });
        if (LEAVE_RANGE.Day === leaveRange) {
          expect(isForReapply(request)).toBe(true);
        } else {
          expect(isForReapply(request)).toBe(false);
        }
      });

      test.each(Object.keys(STATUS))('status: %s', (status) => {
        const request = createRequest({
          requestTypeCode: CODE.Leave,
          // @ts-ignore
          leaveRange: LEAVE_RANGE.Day,
          status,
        });
        if (status === STATUS.Approved) {
          expect(isForReapply(request)).toBe(true);
        } else {
          expect(isForReapply(request)).toBe(false);
        }
      });

      describe('isForReapply', () => {
        test.each(Object.keys(STATUS))('status: %s', (status) => {
          if (STATUS.Approved === status) {
            return;
          }
          const request = createRequest({
            requestTypeCode: CODE.Leave,
            // @ts-ignore
            leaveRange: LEAVE_RANGE.Day,
            isForReapply: true,
            status,
          });
          // @ts-ignore
          if (modify.includes(status)) {
            expect(isForReapply(request)).toBe(true);
          } else {
            expect(isForReapply(request)).toBe(false);
          }
        });
      });
    });
  });
});
