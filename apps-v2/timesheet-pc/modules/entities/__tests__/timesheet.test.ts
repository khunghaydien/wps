import snapshotDiff from 'snapshot-diff';

import msg from '../../../../commons/languages';
import TextUtil from '../../../../commons/utils/TextUtil';

import dummyAPIResponse from '../../../../repositories/__tests__/mocks/response/timesheet-get--fixed-time';

import { CODE as REQUEST_TYPE_CODE } from '../../../../domain/models/attendance/AttDailyRequestType';
import AttRecord from '../../../models/AttRecord';
import { AttDailyRecordFromRemote } from '@apps/domain/models/attendance/AttDailyRecord';

import reducer, {
  // @ts-ignore
  __get__,
  ACTIONS,
  actions,
  initialState,
} from '../timesheet';

describe('reducer()', () => {
  describe(`${ACTIONS.SET_TIMESHEET_ITEMS}`, () => {
    describe('勤務表データ取得APIから取得した構造化されたデータが、変換されてストアに投入される', () => {
      const nextState = reducer(
        initialState,
        actions.setTimesheetItems(dummyAPIResponse, null)
      );

      describe('ownerInfo - 所有者情報', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('ownerInfo');
        });
      });

      describe('attWorkingType - 勤務体系', () => {
        test('上述のフィールド名であること', () => {
          expect(nextState).toHaveProperty('attWorkingType');
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
            'ownerInfo',
            'summaryPeriodList',
            'attWorkingType',
            'attDailyRequestTypeMap',
            'attDailyRequestMap',
            'attSummary',
            'dailyAttentionMessagesMap',
            'dailyContractedDetailMap',
            'attRecordList',
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
      const prev = { ...initialState, attRecordList };

      // Act
      const next = [
        {
          // NONE
          targetDate: '2020-01-01',
          commuteForwardCount: 0,
          commuteBackwardCount: 0,
        },
        {
          // FORWARD
          targetDate: '2020-01-10',
          commuteForwardCount: 1,
          commuteBackwardCount: 0,
        },
        {
          // BACKWARD
          targetDate: '2020-01-15',
          commuteForwardCount: 0,
          commuteBackwardCount: 1,
        },
        {
          // BOTH_WAYS
          targetDate: '2020-01-20',
          commuteForwardCount: 1,
          commuteBackwardCount: 1,
        },
      ].reduce(
        (prev, { commuteForwardCount, commuteBackwardCount, targetDate }) =>
          reducer(
            prev,
            actions.updateCommuteCount(
              commuteForwardCount,
              commuteBackwardCount,
              targetDate
            )
          ),
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
      rest1EndTime: undefined,
      rest1StartTime: undefined,
      rest2EndTime: undefined,
      rest2StartTime: undefined,
      rest3EndTime: undefined,
      rest3StartTime: undefined,
      rest4EndTime: undefined,
      rest4StartTime: undefined,
      rest5EndTime: undefined,
      rest5StartTime: undefined,
      restHours: undefined,
      startStampTime: undefined,
      dayType: AttRecord.DAY_TYPE.WORKDAY,
      insufficientRestTime: null,
      startTime: null,
      endTime: null,
      outStartTime: null,
      outEndTime: null,
      requestIds: [],
      commuteForwardCount: null,
      commuteBackwardCount: null,
      ...param,
    },
    false
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
      expect(attentions).toHaveLength(0);
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
