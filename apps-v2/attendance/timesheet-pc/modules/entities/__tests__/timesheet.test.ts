import snapshotDiff from 'snapshot-diff';

import msg from '../../../../../commons/languages';
import TextUtil from '../../../../../commons/utils/TextUtil';

import dummyAPIResponse from '../../../../repositories/__tests__/mocks/timesheet-get--fixed-time';
// FIXME: 本来ならばドメインの型を使用するべきだが古い実装のために仕方なく使用している
import { DailyRecord as AttDailyRecordFromRemote } from '@attendance/repositories/models/DailyRecord';

import AttRecord from '../../../models/AttRecord';
import { CODE as REQUEST_TYPE_CODE } from '@attendance/domain/models/AttDailyRequestType';
import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';

import reducer, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
  ACTIONS,
  actions,
  initialState,
  State,
} from '../timesheet';

describe('reducer()', () => {
  describe(`${ACTIONS.SET_TIMESHEET_ITEMS}`, () => {
    describe('勤務表データ取得APIから取得した構造化されたデータが、変換されてストアに投入される', () => {
      const nextState = reducer(
        initialState,
        actions.setTimesheetItems(dummyAPIResponse, null)
      );

      describe('ownerInfos - 所有者情報', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('ownerInfos');
        });
      });

      describe('workingTypes - 勤務体系', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('workingTypes');
        });
      });

      describe('workingType - 統一された勤務体系', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('workingType');
        });
      });

      describe('summaryPeriodList - 集計期間の一覧', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('summaryPeriodList');
        });
      });

      describe('attDailyRequestTypeMap - 申請可能な勤怠申請タイプリスト', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('attDailyRequestTypeMap');
        });
      });

      describe('attDailyRequestMap - 申請済みの勤怠申請リスト', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('attDailyRequestMap');
        });

        test('休暇申請が、LeaveRequestとして格納されること', () => {
          expect(nextState.attDailyRequestMap.a077F000000UyG2QAK.type).toEqual(
            'Leave'
          );
        });
      });

      describe('attSummary - 勤怠サマリー', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('attSummary');
        });
      });

      describe('dailyAttentionMessagesMap - 日毎の注意喚起メッセージのマップ ', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('dailyAttentionMessagesMap');
        });
      });

      describe('dailyContractedDetailMap - 日毎の各種所定時刻のマップ', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('dailyContractedDetailMap');
        });
      });

      describe('attRecordList - 集計期間内の勤怠日次明細のリスト', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('attRecordList');
        });
      });

      test('上記以外の内容は投入されない', () => {
        expect(Object.keys(nextState).sort()).toEqual(
          [
            'ownerInfos',
            'summaryPeriodList',
            'workingTypes',
            'workingType',
            'attDailyRequestTypeMap',
            'attDailyRequestMap',
            'attSummary',
            'dailyAttentionMessagesMap',
            'dailyContractedDetailMap',
            'attRecordList',
            'dailyObjectivelyEventLogs',
            'dailyRestCountLimit',
          ].sort()
        );
      });
    });
  });

  describe(`${ACTIONS.UPDATE_COMMUTE_COUNT}`, () => {
    test('should be update Commute Forward Count and Commute BackwardCount to target date.', () => {
      // Arrange
      const attRecordList = [
        {
          recordDate: '2020-01-01',
          commuteForwardCount: 0,
          commuteBackwardCount: 0,
        },
        {
          recordDate: '2020-01-10',
          commuteForwardCount: 0,
          commuteBackwardCount: 0,
        },
        {
          recordDate: '2020-01-15',
          commuteForwardCount: 0,
          commuteBackwardCount: 0,
        },
        {
          recordDate: '2020-01-20',
          commuteForwardCount: 0,
          commuteBackwardCount: 0,
        },
        // @ts-ignore
      ].map((record) => AttRecord.createFromParam(record, false));
      const prev = {
        ...initialState,
        attRecordList,
        workingTypes: [],
      };

      // Act
      const next = [
        {
          // NONE
          targetDate: '2020-01-01',
          commuteCount: {
            forwardCount: 0,
            backwardCount: 0,
          },
        },
        {
          // FORWARD
          targetDate: '2020-01-10',
          commuteCount: {
            forwardCount: 1,
            backwardCount: 0,
          },
        },
        {
          // BACKWARD
          targetDate: '2020-01-15',
          commuteCount: {
            forwardCount: 0,
            backwardCount: 1,
          },
        },
        {
          // BOTH_WAYS
          targetDate: '2020-01-20',
          commuteCount: {
            forwardCount: 1,
            backwardCount: 1,
          },
        },
      ].reduce(
        (prev, { targetDate, commuteCount }) =>
          reducer(prev, actions.updateCommuteCount(targetDate, commuteCount)),
        prev
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });

  describe(`${ACTIONS.CLEAR_REQUEST_TYPE_CODES}`, () => {
    test('should reset all timesheet.records[].requestTypeCodes', () => {
      // Arrange
      const prev = reducer(
        initialState,
        actions.setTimesheetItems(dummyAPIResponse, null)
      );

      // Act
      const next = reducer(prev, actions.clearRequestTypeCodes());

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });

  describe(`${ACTIONS.SET_REQUEST_TYPE_CODES}`, () => {
    test('should set all timesheet.records[].requestTypeCodes', () => {
      // Arrange
      const requestTypeCodesMap = dummyAPIResponse.records.reduce(
        (obj, record) => {
          if (record.requestTypeCodes.length) {
            obj[record.id] = [REQUEST_TYPE_CODE.Absence];
          }
          return obj;
        },
        {}
      );
      const prev = reducer(
        initialState,
        actions.setTimesheetItems(dummyAPIResponse, null)
      );

      // Act
      const next = reducer(
        prev,
        actions.setRequestTypeCodes(requestTypeCodesMap)
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });

  describe(ACTIONS.UPDATE_DAILY_OBJECTIVELY_EVENT_LOG, () => {
    it('should replace for targetDate', () => {
      // Arrange
      const targetDate = '2022-02-22';
      const prev = {
        attRecordList: [],
        dailyAttentionMessageMap: 'OldDailyAttentionMessageMap',
        dailyObjectivelyEventLogs: [
          {
            recordDate: '2022-02-21',
            name: 'old1',
          },
          {
            recordDate: '2022-02-22',
            name: 'old2',
          },
          {
            recordDate: '2022-02-23',
            name: 'old3',
          },
        ],
      } as unknown as State;
      const logs = {
        recordDate: '2022-02-22',
        name: 'new,',
      } as unknown as DailyObjectivelyEventLog;
      const revert = __set__(
        'createDailyAttentionMessageMap',
        jest.fn(() => 'NewDailyAttentionMessageMap')
      );

      // Act
      const result = reducer(
        prev,
        actions.updateDailyObjectivelyEventLog({
          targetDate,
          dailyObjectivelyEventLog: logs,
        })
      );

      // Assert
      expect(result.dailyObjectivelyEventLogs).toHaveLength(3);
      expect(result.dailyObjectivelyEventLogs).toContainEqual(logs);
      expect(result.dailyAttentionMessagesMap).toBe(
        'NewDailyAttentionMessageMap'
      );

      revert();
    });

    it('should remove for targetDate if object is null', () => {
      // Arrange
      const targetDate = '2022-02-22';
      const prev = {
        attRecordList: [],
        dailyAttentionMessageMap: 'OldDailyAttentionMessageMap',
        dailyObjectivelyEventLogs: [
          {
            recordDate: '2022-02-21',
            name: 'old1',
          },
          {
            recordDate: '2022-02-22',
            name: 'old2',
          },
          {
            recordDate: '2022-02-23',
            name: 'old3',
          },
        ],
      } as unknown as State;
      const logs = null;
      const revert = __set__(
        'createDailyAttentionMessageMap',
        jest.fn(() => 'NewDailyAttentionMessageMap')
      );

      // Act
      const result = reducer(
        prev,
        actions.updateDailyObjectivelyEventLog({
          targetDate,
          dailyObjectivelyEventLog: logs,
        })
      );

      // Assert
      expect(result.dailyObjectivelyEventLogs).toHaveLength(2);
      expect(result.dailyObjectivelyEventLogs).not.toContainEqual({
        recordDate: '2022-02-22',
        name: 'old2',
      });
      expect(result.dailyAttentionMessagesMap).toBe(
        'NewDailyAttentionMessageMap'
      );

      revert();
    });
  });
});

const createAttRecordFromPartial = (
  param: Partial<AttDailyRecordFromRemote>
): AttRecord => {
  return AttRecord.createFromParam(
    {
      approver01Name: '',
      ciliTimePeriods: [],
      ciloTimePeriods: [],
      coliTimePeriods: [],
      coloTimePeriods: [],
      contractedDetail: undefined,
      earlyLeaveEndTime: undefined,
      earlyStartWorkApplyDefaultEndTime: undefined,
      endStampTime: undefined,
      id: '',
      isLeaveOfAbsence: false,
      lateArrivalStartTime: undefined,
      overtimeWorkApplyDefaultStartTime: undefined,
      realWorkTime: undefined,
      recordDate: '2017-01-01',
      remarks: undefined,
      requestTypeCodes: [],
      dailyRestList: [],
      restHours: undefined,
      otherRestReason: null,
      startStampTime: undefined,
      dayType: AttRecord.DAY_TYPE.WORKDAY,
      insufficientRestTime: null,
      outInsufficientMinimumWorkHours: null,
      startTime: null,
      endTime: null,
      outStartTime: null,
      outEndTime: null,
      requestIds: [],
      useManageLateArrivalPersonalReason: false,
      useManageEarlyLeavePersonalReason: false,
      workSystem: null,
      flexStartTime: null,
      flexEndTime: null,
      withoutCoreTime: false,
      fixDailyRequest: {
        id: undefined,
        status: undefined,
        approver01Name: undefined,
        performableActionForFix: undefined,
      },
      requestDayType: null,
      isDirectInputTimeRequest: false,
      isLocked: false,
      isHolLegalHoliday: false,
      isFlexWithoutCore: false,
      isFlexWithoutCoreRequireEarlyLeaveApply: false,
      personalReasonEarlyLeaveEndTime: null,
      objectiveReasonEarlyLeaveEndTime: null,
      lateArrivalEarlyLeaveReasonId: '',
      commuteForwardCount: null,
      commuteBackwardCount: null,
      ...param,
    },
    {
      isSummaryLocked: false,
      useFixDailyRequest: false,
    }
  );
};

describe('createDailyAttentionMessages', () => {
  describe('法定休憩不足', () => {
    test('should be Att_Msg_InsufficientRestTime', () => {
      const attRecord = createAttRecordFromPartial({
        dayType: AttRecord.DAY_TYPE.WORKDAY,
        insufficientRestTime: 5,
        startTime: null,
        endTime: null,
        outStartTime: null,
        outEndTime: null,
        requestIds: [],
      });
      const attentions = __get__('createDailyAttentionMessages')(attRecord);
      expect(attentions).toHaveLength(1);
      expect(attentions[0]).toEqual(
        TextUtil.template(msg().Att_Msg_InsufficientRestTime, 5)
      );
    });
  });

  describe('勤務時間外', () => {
    test('時間外で出退勤', () => {
      const attRecord = createAttRecordFromPartial({
        dayType: AttRecord.DAY_TYPE.WORKDAY,
        startTime: 0,
        endTime: 1 * 60,
        outStartTime: 0,
        outEndTime: 0,
        requestIds: [],
      });
      const attentions = __get__('createDailyAttentionMessages')(attRecord);
      expect(attentions).toHaveLength(1);
      expect(attentions[0]).toEqual(
        TextUtil.template(msg().Att_Msg_NotIncludeWorkingTime, '00:00', '01:00')
      );
    });

    test('出勤が時間外', () => {
      const attRecord = createAttRecordFromPartial({
        dayType: AttRecord.DAY_TYPE.WORKDAY,
        startTime: 0,
        endTime: 2 * 60,
        outStartTime: 1 * 60,
        outEndTime: 2 * 60,
        requestIds: [],
      });
      const attentions = __get__('createDailyAttentionMessages')(attRecord);
      expect(attentions).toHaveLength(1);
      expect(attentions[0]).toEqual(
        TextUtil.template(msg().Att_Msg_NotIncludeWorkingTime, '00:00', '01:00')
      );
    });

    test('退勤が時間外', () => {
      const attRecord = createAttRecordFromPartial({
        dayType: AttRecord.DAY_TYPE.WORKDAY,
        startTime: 0,
        endTime: 2 * 60,
        outStartTime: 0,
        outEndTime: 1 * 60,
        requestIds: [],
      });
      const attentions = __get__('createDailyAttentionMessages')(attRecord);
      expect(attentions).toHaveLength(1);
      expect(attentions[0]).toEqual(
        TextUtil.template(msg().Att_Msg_NotIncludeWorkingTime, '01:00', '02:00')
      );
    });

    test('時間内で働いた時間が有るが出退勤時間が時間外', () => {
      const attRecord = createAttRecordFromPartial({
        dayType: AttRecord.DAY_TYPE.WORKDAY,
        startTime: 0,
        endTime: 3 * 60,
        outStartTime: 1 * 60,
        outEndTime: 2 * 60,
        requestIds: [],
      });
      const attentions = __get__('createDailyAttentionMessages')(attRecord);
      expect(attentions).toHaveLength(2);
      expect(attentions[0]).toEqual(
        TextUtil.template(msg().Att_Msg_NotIncludeWorkingTime, '00:00', '01:00')
      );
      expect(attentions[1]).toEqual(
        TextUtil.template(msg().Att_Msg_NotIncludeWorkingTime, '02:00', '03:00')
      );
    });

    test('時間内', () => {
      const attRecord = createAttRecordFromPartial({
        dayType: AttRecord.DAY_TYPE.WORKDAY,
        startTime: 0,
        endTime: 1 * 60,
        outStartTime: 0,
        outEndTime: 1 * 60,
        requestIds: [],
      });
      const attentions = __get__('createDailyAttentionMessages')(attRecord);
      expect(attentions).toBe(null);
    });
  });

  test('複数メッセージ', () => {
    const attRecord = createAttRecordFromPartial({
      dayType: AttRecord.DAY_TYPE.WORKDAY,
      insufficientRestTime: 5,
      startTime: 0,
      endTime: 3 * 60,
      outStartTime: 1 * 60,
      outEndTime: 2 * 60,
      requestIds: [],
    });
    const attentions = __get__('createDailyAttentionMessages')(attRecord);
    expect(attentions).toHaveLength(3);
  });
});
