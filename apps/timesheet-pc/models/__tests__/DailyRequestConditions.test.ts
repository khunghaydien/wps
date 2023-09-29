// @ts-nocheck 関数をテストするためのmockの型の食い違いが多いため、一旦TSのエラーを無視
import STATUS from '../../../domain/models/approval/request/Status';
import * as LeaveRequest from '../../../domain/models/attendance/AttDailyRequest/LeaveRequest';

import AttRecord from '../AttRecord';
import DailyRequestConditions, {
  collectRemarksFromRequests,
} from '../DailyRequestConditions';

describe('timesheet-pc/models/DailyRequestConditions', () => {
  describe('setEffectualAllDayLeaveType()', () => {
    const DUMMY_REQUEST_ID_1 = 'dummy1';
    const DUMMY_REQUEST_ID_2 = 'dummy2';

    const DUMMY_ATT_RECORD = {
      recordDate: '2018-05-11',
      dayType: AttRecord.DAY_TYPE.WORKDAY,
      hasActualWorkingTimes: false,
      isLeaveOfAbsence: false,
      requestIds: [DUMMY_REQUEST_ID_1],
      requestTypeCodes: [],
    };

    const EXPECTED_LEAVE_TYPE = 'Paid';

    const BASE_APPROVED_REQUEST_PARAM = {
      requestTypeCode: 'Leave',
      leaveType: EXPECTED_LEAVE_TYPE,
      status: 'Approved',
    };

    describe('承認済みの休暇申請［全日休］を持つ場合', () => {
      test('effectualAllDayLeaveTypeフィールドに、休暇タイプが適用されること', () => {
        const sampleDailyRequestConditions =
          DailyRequestConditions.createFromParams(
            DUMMY_ATT_RECORD, // AttRecord
            {
              [DUMMY_REQUEST_ID_1]: LeaveRequest.create({
                ...BASE_APPROVED_REQUEST_PARAM,
                leaveRange: 'Day',
              }),
            }, // requestMap
            {}, // requestTypeMap
            {} // otherConditions
          );

        expect(sampleDailyRequestConditions.effectualAllDayLeaveType).toBe(
          EXPECTED_LEAVE_TYPE
        );
      });
    });

    describe('承認済みの休暇申請［午前半休］のみを持つ場合', () => {
      const sampleDailyRequestConditions =
        DailyRequestConditions.createFromParams(
          DUMMY_ATT_RECORD, // AttRecord
          {
            [DUMMY_REQUEST_ID_1]: LeaveRequest.create({
              ...BASE_APPROVED_REQUEST_PARAM,
              leaveRange: 'AM',
            }),
          }, // requestMap
          {}, // requestTypeMap
          {} // otherConditions
        );

      test('effectualAllDayLeaveTypeフィールドが、Falsyのままであること', () => {
        expect(
          sampleDailyRequestConditions.effectualAllDayLeaveType
        ).toBeFalsy();
      });
    });

    describe('承認済みの休暇申請［午後半休］のみを持つ場合', () => {
      const sampleDailyRequestConditions =
        DailyRequestConditions.createFromParams(
          DUMMY_ATT_RECORD, // AttRecord
          {
            [DUMMY_REQUEST_ID_1]: LeaveRequest.create({
              ...BASE_APPROVED_REQUEST_PARAM,
              leaveRange: 'PM',
            }),
          }, // requestMap
          {}, // requestTypeMap
          {} // otherConditions
        );

      test('effectualAllDayLeaveTypeフィールドが、Falsyのままであること', () => {
        expect(
          sampleDailyRequestConditions.effectualAllDayLeaveType
        ).toBeFalsy();
      });
    });

    describe('承認済みの休暇申請［午前半休］と休暇申請［午後半休］の両方を持つ場合', () => {
      const sampleDailyRequestConditions =
        DailyRequestConditions.createFromParams(
          {
            ...DUMMY_ATT_RECORD,
            requestIds: [DUMMY_REQUEST_ID_1, DUMMY_REQUEST_ID_2],
          }, // AttRecord
          {
            [DUMMY_REQUEST_ID_1]: LeaveRequest.create({
              ...BASE_APPROVED_REQUEST_PARAM,
              leaveRange: 'AM',
            }),
            [DUMMY_REQUEST_ID_2]: LeaveRequest.create({
              ...BASE_APPROVED_REQUEST_PARAM,
              leaveRange: 'PM',
            }),
          }, // requestMap
          {}, // requestTypeMap
          {} // otherConditions
        );

      test('effectualAllDayLeaveTypeフィールドが、Falsyのままであること', () => {
        expect(
          sampleDailyRequestConditions.effectualAllDayLeaveType
        ).toBeFalsy();
      });
    });

    describe('承認済みの休暇申請［時間指定半休］を持つ場合', () => {
      const sampleDailyRequestConditions =
        DailyRequestConditions.createFromParams(
          DUMMY_ATT_RECORD, // AttRecord
          {
            [DUMMY_REQUEST_ID_1]: LeaveRequest.create({
              ...BASE_APPROVED_REQUEST_PARAM,
              leaveRange: 'Half',
            }),
          }, // requestMap
          {}, // requestTypeMap
          {} // otherConditions
        );

      test('effectualAllDayLeaveTypeフィールドが、Falsyのままであること', () => {
        expect(
          sampleDailyRequestConditions.effectualAllDayLeaveType
        ).toBeFalsy();
      });
    });

    describe('承認済みの休暇申請［時間単位休］を持つ場合', () => {
      const sampleDailyRequestConditions =
        DailyRequestConditions.createFromParams(
          DUMMY_ATT_RECORD, // AttRecord
          {
            [DUMMY_REQUEST_ID_1]: LeaveRequest.create({
              ...BASE_APPROVED_REQUEST_PARAM,
              leaveRange: 'Time',
            }),
          }, // requestMap
          {}, // requestTypeMap
          {} // otherConditions
        );

      test('effectualAllDayLeaveTypeフィールドが、Falsyのままであること', () => {
        expect(
          sampleDailyRequestConditions.effectualAllDayLeaveType
        ).toBeFalsy();
      });
    });
  });

  describe('collectRemarksFromRequests()', () => {
    describe('提出済みの申請から備考の内容を抽出する', () => {
      const sampleRequestWithRemarks1 = LeaveRequest.create({
        requestTypeName: '申請種別1',
        remarks: '申請コメント1',
      });

      const sampleRequestWithRemarks2 = LeaveRequest.create({
        requestTypeName: '申請種別2',
        remarks: '申請コメント2',
      });

      const sampleRequestWithEmptyStringRemarks = LeaveRequest.create({
        requestTypeName: '申請種別3',
        remarks: '',
      });

      const sampleRequestWithoutRemarks = LeaveRequest.create({
        requestTypeName: '申請種別4',
        remarks: null,
      });

      test('返却値が、requestTypeNameとremarksをフィールドに持つオブジェクトの配列であること', () => {
        const result = collectRemarksFromRequests({
          latestRequests: [
            sampleRequestWithRemarks1,
            sampleRequestWithRemarks2,
          ],
        });

        expect(result).toEqual([
          { requestTypeName: '申請種別1', remarks: '申請コメント1' },
          { requestTypeName: '申請種別2', remarks: '申請コメント2' },
        ]);
      });

      test('備考がnullもしくは空文字列の申請は無視され、返却値の配列に含まれないこと', () => {
        const result = collectRemarksFromRequests({
          latestRequests: [
            sampleRequestWithRemarks1,
            sampleRequestWithEmptyStringRemarks,
            sampleRequestWithoutRemarks,
          ],
        });

        expect(result).toEqual([
          { requestTypeName: '申請種別1', remarks: '申請コメント1' },
        ]);
      });

      test('提出済みの申請が無い場合、nullが返却されること', () => {
        const result = collectRemarksFromRequests({});
        expect(result).toBeNull();
      });
    });
  });

  describe('setAvailabilityToOperateAttTime()', () => {
    describe('打刻時間の操作が可能か否か判定する', () => {
      describe('日タイプ:平日', () => {
        const BASE_ATTRECORD_ON_WORKDAY = {
          recordDate: '2018-05-11',
          dayType: AttRecord.DAY_TYPE.WORKDAY,
          hasActualWorkingTimes: false,
          isLeaveOfAbsence: false,
          requestIds: [],
          requestTypeCodes: [],
        };
        const BASE_ATTRECORD_ON_HOLIDAY = {
          recordDate: '2018-05-11',
          dayType: AttRecord.DAY_TYPE.HOLIDAY,
          hasActualWorkingTimes: false,
          isLeaveOfAbsence: false,
          requestIds: [],
          requestTypeCodes: [],
        };
        const ALLDAY_LEAVE_APPROVED_REQUEST = {
          requestTypeCode: 'Leave',
          leaveType: 'Paid',
          leaveRange: 'Day',
          isEffectualLeaveRequest: true,
          status: 'Approved',
        };
        const ALLDAY_LEAVE_APPROVELIN_REQUEST = {
          requestTypeCode: 'Leave',
          leaveType: 'Paid',
          leaveRange: 'Day',
          isEffectualLeaveRequest: false,
          status: 'Approval In',
        };
        const HOLIDAY_WORK_WITH_SUBSTITUTE_DATE_IS_FOR_REAPPLY_REQUEST = {
          requestTypeCode: 'HolidayWork',
          substituteLeaveType: 'Substitute',
          targetDate: '2018-05-12',
          substituteDate: '2018-05-11',
          isEffectualLeaveRequest: false,
          status: 'Approval In',
        };
        const HOLIDAY_WORK_WITH_SUBSTITUTE_DATE_REAPPLY_REQUEST = {
          requestTypeCode: 'HolidayWork',
          substituteLeaveType: 'Substitute',
          targetDate: '2018-05-11',
          substituteDate: '2018-05-12',
          isEffectualLeaveRequest: false,
          status: 'Reapplying',
        };
        test('通常の勤務日の場合は打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
              }, // AttRecord
              {}, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
        test('有効な全日の休暇申請があれば、打刻時間操作不可', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: ALLDAY_LEAVE_APPROVED_REQUEST }, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(false);
        });
        test('有効な全日の休暇申請があっても、実労働時間があれば打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                hasActualWorkingTimes: true,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: ALLDAY_LEAVE_APPROVED_REQUEST }, // requestMap
              {},
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
        test('承認待ちの全日の休暇申請があれば、打刻時間操作不可', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: ALLDAY_LEAVE_APPROVELIN_REQUEST }, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(false);
        });
        test('承認待ちの全日の休暇申請があっても、実労働時間があれば打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                hasActualWorkingTimes: true,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: ALLDAY_LEAVE_APPROVELIN_REQUEST }, // requestMap
              {},
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
        test('承認待ちの休日出勤申請で振替休日があれば、打刻時間操作不可', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: HOLIDAY_WORK_WITH_SUBSTITUTE_DATE_IS_FOR_REAPPLY_REQUEST }, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(false);
        });
        test('承認待ちの休日出勤申請で振替休日であっても、実労働時間があれば打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                hasActualWorkingTimes: true,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: HOLIDAY_WORK_WITH_SUBSTITUTE_DATE_IS_FOR_REAPPLY_REQUEST }, // requestMap
              {},
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
        test('承認待ちの変更申請であれば、打刻時間操作不可', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                // Approved もしくは Reapplying は休日として扱われる。
                ...BASE_ATTRECORD_ON_HOLIDAY,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: HOLIDAY_WORK_WITH_SUBSTITUTE_DATE_REAPPLY_REQUEST }, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(false);
        });
        test('承認待ちの変更申請であっても、実労働時間があれば打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                // Approved もしくは Reapply は休日として扱われる。
                ...BASE_ATTRECORD_ON_HOLIDAY,
                hasActualWorkingTimes: true,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: HOLIDAY_WORK_WITH_SUBSTITUTE_DATE_REAPPLY_REQUEST }, // requestMap
              {},
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
        test('休職・休業期間中は、打刻時間操作不可', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                isLeaveOfAbsence: true,
              }, // AttRecord
              {}, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(false);
        });
        test('休職・休業期間中であっても、実労働時間があれば打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_WORKDAY,
                hasActualWorkingTimes: true,
                isLeaveOfAbsence: true,
              }, // AttRecord
              {}, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
      });
      describe('日タイプ:休日', () => {
        const BASE_ATTRECORD_ON_HOLIDAY = {
          recordDate: '2018-05-19',
          dayType: AttRecord.DAY_TYPE.HOLIDAY,
          hasActualWorkingTimes: false,
          isLeaveOfAbsence: false,
          requestIds: [],
          requestTypeCodes: [],
        };
        const BASE_HOLIDAY_WORK_REQUEST = {
          requestTypeCode: 'HolidayWork',
          startDate: '2018-05-19',
          isEffectualHolidayWorkRequest: true,
          status: 'Approved',
        };
        test('通常の休日の場合は打刻時間操作不可', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_HOLIDAY,
              }, // AttRecord
              {}, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(false);
        });
        test('有効な休日出勤申請があれば、打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_HOLIDAY,
                requestIds: ['abc'],
              }, // AttRecord
              { abc: BASE_HOLIDAY_WORK_REQUEST }, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
        test('休職・休業期間中は、打刻時間操作不可', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_HOLIDAY,
                isLeaveOfAbsence: true,
              }, // AttRecord
              {}, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(false);
        });
        test('休職・休業期間中であっても、実労働時間があれば打刻時間操作可能', () => {
          const someDailyRequestConditions =
            DailyRequestConditions.createFromParams(
              {
                ...BASE_ATTRECORD_ON_HOLIDAY,
                hasActualWorkingTimes: true,
                isLeaveOfAbsence: true,
              }, // AttRecord
              {}, // requestMap
              {}, // requestTypeMap
              {} // otherConditions
            );
          const result = someDailyRequestConditions.isAvailableToOperateAttTime;
          expect(result).toBe(true);
        });
      });
    });
  });

  describe('isPaternityLeaveAtBirth', () => {
    const BASE_ATTRECORD_ON_WORKDAY = {
      recordDate: '2018-05-19',
      dayType: AttRecord.DAY_TYPE.WORKDAY,
      hasActualWorkingTimes: false,
      isLeaveOfAbsence: true,
      requestIds: ['direct'],
      requestTypeCodes: [],
    };
    const BASE_DIRECT_REQUEST = {
      requestTypeCode: 'Direct',
      startDate: '2018-05-19',
      status: 'Approved',
    };
    test.each`
      status                 | expected
      ${STATUS.Approved}     | ${true}
      ${STATUS.ApprovalIn}   | ${false}
      ${STATUS.Canceled}     | ${false}
      ${STATUS.Rejected}     | ${false}
      ${STATUS.Recalled}     | ${false}
      ${STATUS.NotRequested} | ${false}
    `('休職休業中でも産後パパ育休であれば操作可能', ({ status, expected }) => {
      const someDailyRequestConditions =
        DailyRequestConditions.createFromParams(
          {
            ...BASE_ATTRECORD_ON_WORKDAY,
          }, // AttRecord
          {
            direct: { ...BASE_DIRECT_REQUEST, status },
          }, // requestMap
          {}, // requestTypeMap
          {} // otherConditions
        );
      const result = someDailyRequestConditions.isPaternityLeaveAtBirth;
      expect(result).toBe(expected);
    });
  });
});
