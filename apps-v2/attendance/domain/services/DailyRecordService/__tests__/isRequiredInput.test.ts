import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import {
  AttDailyRequest as DailyRequest,
  STATUS as REQUEST_STATUS,
  Status as REQUEST_STATUS_TYPE,
} from '@attendance/domain/models/AttDailyRequest';
import {
  CODE as REQUEST_TYPE_CODE,
  Code as REQUEST_TYPE,
} from '@attendance/domain/models/AttDailyRequestType';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import isRequiredInput from '../isRequiredInput';

const startDate = '2018-10-01';

const createLeaveRequest = (params: {
  leaveRange: DailyRequest['leaveRange'];
  substituteLeaveType?: DailyRequest['substituteLeaveType'];
  substituteDate?: DailyRequest['substituteDate'];
  originalRequestId?: DailyRequest['originalRequestId'];
  isForReapply?: DailyRequest['isForReapply'];
}): DailyRequest =>
  ({
    requestTypeCode: REQUEST_TYPE_CODE.Leave,
    ...params,
  } as unknown as DailyRequest);

const createHolidayWorkRequest = (params: {
  startDate?: DailyRequest['startDate'];
  substituteDate: DailyRequest['substituteDate'];
}): DailyRequest =>
  ({
    requestTypeCode: REQUEST_TYPE_CODE.HolidayWork,
    ...params,
  } as unknown as DailyRequest);

const createAbsenceRequest = (): DailyRequest =>
  ({
    requestTypeCode: REQUEST_TYPE_CODE.Absence,
  } as unknown as DailyRequest);

const createDirectRequest = (): DailyRequest =>
  ({
    requestTypeCode: REQUEST_TYPE_CODE.Direct,
  } as unknown as DailyRequest);

const createPatternRequest = (params: {
  requestDayType: DailyRequest['requestDayType'];
}): DailyRequest =>
  ({
    requestTypeCode: REQUEST_TYPE_CODE.Pattern,
    ...params,
  } as unknown as DailyRequest);

const createRequest = (
  requestTypeCode: REQUEST_TYPE,
  requestStatus: REQUEST_STATUS_TYPE,
  params: Record<string, unknown> = {}
): DailyRequest =>
  ({
    requestTypeCode,
    status: requestStatus,
    ...(params || {}),
  } as unknown as DailyRequest);

describe('Has request', () => {
  test.each([
    [
      DAY_TYPE.Workday,
      createLeaveRequest({
        leaveRange: LEAVE_RANGE.Day,
      }),
      {
        APPROVAL_IN: false,
        APPROVED: false,
        REJECTED: false,
        RECALLED: false,
        CANCELED: false,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      createLeaveRequest({
        leaveRange: LEAVE_RANGE.AM,
      }),
      {
        ApprovalIn: true,
        APPROVED: true,
        REJECTED: true,
        RECALLED: true,
        CANCELED: true,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      createHolidayWorkRequest({
        substituteDate: startDate,
      }),
      {
        APPROVAL_IN: false,
        APPROVED: false,
        REJECTED: false,
        RECALLED: false,
        CANCELED: false,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      createHolidayWorkRequest({
        substituteDate: '2018-11-01',
      }),
      {
        APPROVAL_IN: true,
        APPROVED: true,
        REJECTED: true,
        RECALLED: true,
        CANCELED: true,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      createAbsenceRequest(),
      {
        APPROVAL_IN: false,
        APPROVED: false,
        REJECTED: false,
        RECALLED: false,
        CANCELED: false,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      createDirectRequest(),
      {
        APPROVAL_IN: false,
        APPROVED: true,
        REJECTED: true,
        RECALLED: true,
        CANCELED: true,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      createPatternRequest({
        requestDayType: DAY_TYPE.Workday,
      }),
      {
        APPROVAL_IN: true,
        APPROVED: true,
        REJECTED: true,
        RECALLED: true,
        CANCELED: true,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      createPatternRequest({
        requestDayType: DAY_TYPE.Holiday,
      }),
      {
        APPROVAL_IN: false,
        APPROVED: false,
        REJECTED: false,
        RECALLED: false,
        CANCELED: false,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Workday,
      {
        requestTypeCode: REQUEST_TYPE_CODE.EarlyStartWork,
      } as unknown as DailyRequest,
      {
        APPROVAL_IN: true,
        APPROVED: true,
        REJECTED: true,
        RECALLED: true,
        CANCELED: true,
        REAPPLYING: true,
      },
    ],
    [
      DAY_TYPE.Holiday,
      createHolidayWorkRequest({
        startDate,
        substituteDate: '2018-11-01',
      }),
      {
        APPROVAL_IN: false,
        APPROVED: true,
        REJECTED: false,
        RECALLED: false,
        CANCELED: false,
        REAPPLYING: false,
      },
    ],
    [
      DAY_TYPE.LegalHoliday,
      createHolidayWorkRequest({
        startDate,
        substituteDate: '2018-11-01',
      }),
      {
        APPROVAL_IN: false,
        APPROVED: true,
        REJECTED: false,
        RECALLED: false,
        CANCELED: false,
        REAPPLYING: false,
      },
    ],
    [
      DAY_TYPE.Holiday,
      createHolidayWorkRequest({
        startDate: '2018-11-01',
        substituteDate: startDate,
      }),
      {
        APPROVAL_IN: false,
        APPROVED: false,
        REJECTED: false,
        RECALLED: false,
        CANCELED: false,
        REAPPLYING: false,
      },
    ],
  ])('%s\n%o\n%o', (dayType, request, results) => {
    Object.keys(results).forEach((key) => {
      expect(
        isRequiredInput({
          recordDate: startDate,
          dayType,
          isLeaveOfAbsence: false,
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

describe('LeaveRequest on HolidayWorkRequest', () => {
  const holidayWork = createRequest(
    REQUEST_TYPE_CODE.Pattern,
    REQUEST_STATUS.APPROVED
  );
  const leave = createRequest(REQUEST_TYPE_CODE.Leave, REQUEST_STATUS.APPROVED);
  describe.each([
    DAY_TYPE.Holiday,
    DAY_TYPE.PreferredLegalHoliday,
    DAY_TYPE.LegalHoliday,
  ])('%s', (dayType) => {
    it.each`
      requests                                                     | expected
      ${[holidayWork, { ...leave, leaveRange: LEAVE_RANGE.Day }]}  | ${false}
      ${[holidayWork, { ...leave, leaveRange: LEAVE_RANGE.Half }]} | ${false}
      ${[holidayWork, { ...leave, leaveRange: LEAVE_RANGE.Time }]} | ${false}
    `(
      'should be $expected if requests are $requests.',
      ({ requests, expected }) => {
        expect(
          isRequiredInput({
            recordDate: startDate,
            dayType,
            isLeaveOfAbsence: false,
            requests,
          })
        ).toBe(expected);
      }
    );
  });
});

describe('No request', () => {
  test.each([
    [DAY_TYPE.Workday, true],
    [DAY_TYPE.Holiday, false],
    [DAY_TYPE.PreferredLegalHoliday, false],
    [DAY_TYPE.LegalHoliday, false],
  ])('%s: %p', (dayType, result) => {
    expect(
      isRequiredInput({
        recordDate: startDate,
        isLeaveOfAbsence: false,
        dayType,
        requests: [],
      })
    ).toBe(result);
  });
});

describe('isLeaveOfAbsence', () => {
  it.each`
    requestTypeCode                 | requestStatus                   | params                              | expected
    ${REQUEST_TYPE_CODE.Pattern}    | ${REQUEST_STATUS.APPROVED}      | ${{}}                               | ${true}
    ${REQUEST_TYPE_CODE.Pattern}    | ${REQUEST_STATUS.APPROVAL_IN}   | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Pattern}    | ${REQUEST_STATUS.NOT_REQUESTED} | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Pattern}    | ${REQUEST_STATUS.REJECTED}      | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Pattern}    | ${REQUEST_STATUS.RECALLED}      | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Pattern}    | ${REQUEST_STATUS.CANCELED}      | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Absence}    | ${REQUEST_STATUS.APPROVED}      | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Absence}    | ${REQUEST_STATUS.APPROVAL_IN}   | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Absence}    | ${REQUEST_STATUS.NOT_REQUESTED} | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Absence}    | ${REQUEST_STATUS.REJECTED}      | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Absence}    | ${REQUEST_STATUS.RECALLED}      | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Absence}    | ${REQUEST_STATUS.CANCELED}      | ${{}}                               | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.APPROVED}      | ${{ leaveRange: LEAVE_RANGE.Day }}  | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.APPROVAL_IN}   | ${{ leaveRange: LEAVE_RANGE.Day }}  | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.NOT_REQUESTED} | ${{ leaveRange: LEAVE_RANGE.Day }}  | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.REJECTED}      | ${{ leaveRange: LEAVE_RANGE.Day }}  | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.RECALLED}      | ${{ leaveRange: LEAVE_RANGE.Day }}  | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.CANCELED}      | ${{ leaveRange: LEAVE_RANGE.Day }}  | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.APPROVED}      | ${{ leaveRange: LEAVE_RANGE.AM }}   | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.APPROVED}      | ${{ leaveRange: LEAVE_RANGE.PM }}   | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.APPROVED}      | ${{ leaveRange: LEAVE_RANGE.Half }} | ${false}
    ${REQUEST_TYPE_CODE.Leave}      | ${REQUEST_STATUS.APPROVED}      | ${{ leaveRange: LEAVE_RANGE.Time }} | ${false}
    ${REQUEST_TYPE_CODE.EarlyLeave} | ${REQUEST_STATUS.APPROVED}      | ${{}}                               | ${false}
  `(
    'should be $expected when isLeaveOfAbsence=$isLeaveOfAbsence, requestTypeCode=$requestTypeCode, requestStatus=$requestStatus, params=$params',
    ({ requestTypeCode, requestStatus, params, expected }) => {
      expect(
        isRequiredInput({
          recordDate: startDate,
          dayType: DAY_TYPE.Workday,
          isLeaveOfAbsence: true,
          requests: [createRequest(requestTypeCode, requestStatus, params)],
        })
      ).toBe(expected);
    }
  );

  describe('Multiple request', () => {
    const pattern = createRequest(
      REQUEST_TYPE_CODE.Pattern,
      REQUEST_STATUS.APPROVED
    );
    const absence = createRequest(
      REQUEST_TYPE_CODE.Absence,
      REQUEST_STATUS.APPROVED
    );
    const leave = createRequest(
      REQUEST_TYPE_CODE.Leave,
      REQUEST_STATUS.APPROVED,
      {
        leaveRange: LEAVE_RANGE.Day,
      }
    );

    it.each`
      requests              | expected
      ${[pattern]}          | ${true}
      ${[pattern, absence]} | ${false}
      ${[pattern, leave]}   | ${false}
      ${[absence, leave]}   | ${false}
    `(
      'should be $expected if requests are $requests',
      ({ requests, expected }) => {
        expect(
          isRequiredInput({
            recordDate: startDate,
            dayType: DAY_TYPE.Workday,
            isLeaveOfAbsence: true,
            requests,
          })
        ).toBe(expected);
      }
    );
  });

  describe('HolidayWorkRequest', () => {
    const holidayWork = createRequest(
      REQUEST_TYPE_CODE.Pattern,
      REQUEST_STATUS.APPROVED
    );
    const leave = createRequest(
      REQUEST_TYPE_CODE.Leave,
      REQUEST_STATUS.APPROVED
    );
    describe.each([
      DAY_TYPE.Holiday,
      DAY_TYPE.PreferredLegalHoliday,
      DAY_TYPE.LegalHoliday,
    ])('%s', (dayType) => {
      it.each`
        requests                                                     | expected
        ${[holidayWork, { ...leave, leaveRange: LEAVE_RANGE.Day }]}  | ${false}
        ${[holidayWork, { ...leave, leaveRange: LEAVE_RANGE.Half }]} | ${true}
        ${[holidayWork, { ...leave, leaveRange: LEAVE_RANGE.Time }]} | ${true}
      `(
        'should be $expected if requests are $requests.',
        ({ requests, expected }) => {
          expect(
            isRequiredInput({
              recordDate: startDate,
              dayType,
              isLeaveOfAbsence: true,
              requests,
            })
          ).toBe(expected);
        }
      );
    });
  });
});
