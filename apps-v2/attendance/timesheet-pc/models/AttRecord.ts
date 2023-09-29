import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { convert as convertToCommuteCountFromRemote } from '@attendance/repositories/models/CommuteCount';
// FIXME: API未加工のモデルは使いたくないが古い実装に合わせるために仕方なく使用している
import {
  DailyRecord as AttDailyRecordFromRemote,
  DailyRecordContractedDetail as AttDailyRecordContractedDetailFromRemote,
  DailyRest,
} from '@attendance/repositories/models/DailyRecord';

import { Code as AttRequestTypeCode } from '@attendance/domain/models/AttDailyRequestType';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import { FixDailyRequest } from '@attendance/domain/models/FixDailyRequest';
import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

/**
 * [Entity] 日次勤怠明細（＋申請情報・備考など）
 */
export default class AttRecord {
  // APIレスポンスそのままのフィールド

  /**
   * 勤怠日次明細ID
   */
  id: string;

  /**
   * 日付(YYYY-MM-DD形式の文字列)
   */
  recordDate: string;

  /**
   * 日タイプ(AttDayType（グローバル選択リスト）の値)
   */
  dayType: 'Workday' | 'Holiday' | 'LegalHoliday' | 'PreferredLegalHoliday';

  /**
   * 出勤時刻
   */
  startTime: number;

  /**
   * 退勤時刻
   */
  endTime: number;

  /**
   * 出勤打刻時刻
   */
  startStampTime: number;

  /**
   * 退勤打刻時刻
   */
  endStampTime: number;

  /**
   * 実効出勤時間
   */
  outStartTime: number;

  /**
   * 実効退勤時間
   */
  outEndTime: number;

  /**
   * 休憩リスト
   */
  dailyRestList: DailyRest[];

  /**
   * その他の休憩時間
   */
  restHours: number;

  /**
   * その他の休憩理由
   */
  otherRestReason: RestTimeReason | null;

  /**
   * 備考
   */
  remarks: string;

  /**
   * 申請可能な勤怠申請タイプコード一覧
   */
  requestTypeCodes: Array<AttRequestTypeCode>;

  /**
   * 申請済みの勤怠申請ID一覧
   */
  requestIds: Array<string>;

  /**
   * 勤務所定情報
   */
  contractedDetail: AttDailyRecordContractedDetailFromRemote;

  /**
   * 所定内法定内勤務時間帯
   */
  ciliTimePeriods: { startTime: number; endTime: number }[];

  /**
   * 所定内法定外勤務時間帯
   */
  ciloTimePeriods: { startTime: number; endTime: number }[];

  /**
   * 所定外法定内勤務時間帯
   */
  coliTimePeriods: { startTime: number; endTime: number }[];

  /**
   * 所定外法定外勤務時間帯
   */
  coloTimePeriods: { startTime: number; endTime: number }[];

  /**
   * 承認者
   */
  approver01Name: string;

  /**
   * 早退の終了時刻
   */
  earlyLeaveEndTime: number;

  /**
   * 日次確定による日次にロック状態のフラグ
   * - 開発予定の日次確定を想定した実装。日次確定に対応する際に、妥当か再確認する
   */
  isLocked: boolean;

  /**
   * 月次確定によるサマリー全体のロック状態のフラグ
   */
  isSummaryLocked: boolean;

  /**
   * 休職・休業中かどうかのフラグ
   */
  isLeaveOfAbsence: boolean;

  /**
   * 不足休憩時間
   */
  insufficientRestTime: number;

  /**
   * 月次と日次にもとづくロックフラグ ※後続の自己移譲で初期化する
   */
  isTotallyLocked: boolean;

  /**
   * 勤怠の記録を持つか否かのフラグ ※後続の自己移譲で初期化する
   */
  hasActualWorkingTimes: boolean;

  /**
   * 実労働時間を表現できるか（グラフとして） ※後続の自己移譲で初期化する
   */
  isActualWorkingTimeRepresentable: boolean;

  /**
   * その他休憩時間を表示するかしないか
   */
  hasRestTime: boolean;

  /**
   * 早朝勤務申請デフォルト終了時刻
   */
  earlyStartWorkApplyDefaultEndTime: number;

  /**
   * 残業申請デフォルト開始時刻
   */
  overtimeWorkApplyDefaultStartTime: number;

  // NOTE:
  // 以下のコードは本来View（presentational-component）側の処理にすべきだが、
  // 下記の問題によりこちらに記述している。
  // * 勤怠時間グラフのドラッグ操作にパフォーマンス面の悪影響があるためrender内は不適
  // * ComponentのLifecycleメソッド内で判定するにしても、やはりパフォーマンス劣化が懸念される
  // TODO: パフォーマンスを計測しながら適した記述場所を探る

  /**
   * ［表示用］日付
   */
  displayDate: number;

  /**
   * ［表示用］曜日
   */
  displayDay: string;

  /**
   * ［表示用］出勤時刻
   */
  displayStartTime: string;

  /**
   * ［表示用］退勤時刻
   */
  displayEndTime: string;

  /**
   * 遅刻開始時間
   */
  lateArrivalStartTime: number;

  realWorkTime: number;

  /**
   * 通勤回数
   */
  commuteCount: CommuteCount;

  /**
   * 遅刻の自責管理
   */
  useManageLateArrivalPersonalReason: boolean;

  /**
   * 早退の自責管理
   */
  useManageEarlyLeavePersonalReason: boolean;

  /**
   * フレックス開始時刻
   */
  flexStartTime: number;

  /**
   * フレックス終了時刻
   */
  flexEndTime: number;

  /**
   * 労働時間制
   */
  workSystem: string;

  /**
   * コアタイムなし
   */
  withoutCoreTime: boolean;

  /* 日次勤務確定申請 */
  fixDailyRequest: FixDailyRequest;

  /**
   * 勤務変更の日タイプ
   */
  requestDayType: string | null;

  /**
   * 直接入力
   */
  isDirectInputTimeRequest: boolean;

  /**
   * 法定休日フラグ
   */
  isHolLegalHoliday: boolean;

  /**
   * 不足最低勤務時間
   */
  outInsufficientMinimumWorkHours: number;

  /* 労働時間制がコアなしフレックスフラグ */
  isFlexWithoutCore: boolean;

  /* 早退時に申請を必須とするフラグ */
  isFlexWithoutCoreRequireEarlyLeaveApply: boolean;

  /* コアなしフレックス自責場合の早退の終了時刻 */
  personalReasonEarlyLeaveEndTime: number;

  /* コアなしフレックス他責場合の早退の終了時刻 */
  objectiveReasonEarlyLeaveEndTime: number;
  /**
   * 遅刻早退理由
   */
  lateArrivalEarlyLeaveReasonId: string | null;

  constructor(
    param: Omit<
      AttDailyRecordFromRemote,
      'commuteForwardCount' | 'commuteBackwardCount'
    > & {
      commuteCount: CommuteCount;
      isSummaryLocked: boolean;
      useFixDailyRequest: boolean;
    }
  ) {
    this.id = param.id;
    this.recordDate = param.recordDate;
    this.dayType = param.dayType;
    this.startTime = param.startTime;
    this.endTime = param.endTime;
    this.startStampTime = param.startStampTime;
    this.endStampTime = param.endStampTime;
    this.outStartTime = param.outStartTime;
    this.outEndTime = param.outEndTime;
    this.dailyRestList = param.dailyRestList;
    this.restHours = param.restHours;
    this.otherRestReason = param.otherRestReason;
    this.remarks = param.remarks;
    this.requestTypeCodes = param.requestTypeCodes;
    this.requestIds = param.requestIds;
    this.contractedDetail = param.contractedDetail;
    this.ciliTimePeriods = param.ciliTimePeriods;
    this.ciloTimePeriods = param.ciloTimePeriods;
    this.coliTimePeriods = param.coliTimePeriods;
    this.coloTimePeriods = param.coloTimePeriods;
    this.approver01Name = param.approver01Name;
    this.earlyLeaveEndTime = param.earlyLeaveEndTime;
    this.useManageLateArrivalPersonalReason =
      param.useManageLateArrivalPersonalReason;
    this.useManageEarlyLeavePersonalReason =
      param.useManageEarlyLeavePersonalReason;
    this.outInsufficientMinimumWorkHours =
      param.outInsufficientMinimumWorkHours;
    this.flexStartTime = param.flexStartTime;
    this.flexEndTime = param.flexEndTime;
    this.workSystem = param.workSystem;
    this.withoutCoreTime = param.withoutCoreTime;
    this.isLocked = param.useFixDailyRequest ? param.isLocked : false;
    this.isSummaryLocked = param.isSummaryLocked;
    this.isLeaveOfAbsence = param.isLeaveOfAbsence;
    this.insufficientRestTime = param.insufficientRestTime;
    this.isTotallyLocked = null;
    this.hasActualWorkingTimes = null;
    this.isActualWorkingTimeRepresentable = false;
    this.hasRestTime = !!(this.restHours + this.insufficientRestTime);
    this.earlyStartWorkApplyDefaultEndTime =
      param.earlyStartWorkApplyDefaultEndTime;
    this.overtimeWorkApplyDefaultStartTime =
      param.overtimeWorkApplyDefaultStartTime;

    this.setTotallyLockStatus();
    this.setPossessionOfActualWorkingTimes();
    this.setRepresentabilityOfActualWorkingTime();

    this.displayDate = DateUtil.getDate(this.recordDate);
    this.displayDay = DateUtil.formatWeekday(this.recordDate);
    this.displayStartTime = TimeUtil.toHHmm(this.startTime);
    this.displayEndTime = TimeUtil.toHHmm(this.endTime);
    this.lateArrivalStartTime = param.lateArrivalStartTime;

    this.commuteCount = param.commuteCount;

    this.fixDailyRequest = param.fixDailyRequest;

    this.requestDayType = param.requestDayType;
    this.isDirectInputTimeRequest = param.isDirectInputTimeRequest;
    this.isHolLegalHoliday = param.isHolLegalHoliday;
    this.isFlexWithoutCore = param.isFlexWithoutCore;
    this.isFlexWithoutCoreRequireEarlyLeaveApply =
      param.isFlexWithoutCoreRequireEarlyLeaveApply;
    this.personalReasonEarlyLeaveEndTime =
      param.personalReasonEarlyLeaveEndTime;
    this.objectiveReasonEarlyLeaveEndTime =
      param.objectiveReasonEarlyLeaveEndTime;
    this.isFlexWithoutCoreRequireEarlyLeaveApply =
      param.isFlexWithoutCoreRequireEarlyLeaveApply;
    this.lateArrivalEarlyLeaveReasonId = param.lateArrivalEarlyLeaveReasonId;
  }

  /**
   * ロックフラグの状態を、日次と集計期間のロック状態に基づいて設定する
   * @private
   */
  setTotallyLockStatus() {
    this.isTotallyLocked = this.isLocked || this.isSummaryLocked;
  }

  /**
   * 実労働時間を（グラフとして）表現できるかを判別して、プロパティに結果を適用する
   * - 出勤時刻（startTime）もしくは退勤時刻（endTime）があれば、グラフ描画可能とする
   * - 上記がどちらもない場合、実労働時間をグラフ描画不可とする
   *   ※勤怠明細の作成時に所定からコピーされた休憩時間の描画を抑制するため
   * @private
   */
  setRepresentabilityOfActualWorkingTime() {
    this.isActualWorkingTimeRepresentable =
      this.startTime !== null || this.endTime !== null;
  }

  /**
   * 勤怠の記録を持つか否かを判別して、プロパティに結果を適用する
   * - 出退勤時刻（手入力）の記録を持つ場合、それを編集する手段を提供する
   * @private
   */
  setPossessionOfActualWorkingTimes() {
    this.hasActualWorkingTimes =
      this.startTime !== null || this.endTime !== null;
  }

  /**
   * @param {Object} param 勤務表データ取得APIレスポンスのrecordsフィールドの要素
   * @param {Boolean} isSummaryLocked
   * @return {AttRecord}
   */
  static createFromParam(
    param: Omit<AttDailyRecordFromRemote, 'fixDailyRequest'> & {
      fixDailyRequest: FixDailyRequest;
    },
    {
      isSummaryLocked,
      useFixDailyRequest,
    }: { isSummaryLocked: boolean; useFixDailyRequest: boolean }
  ) {
    return new AttRecord({
      ...param,
      commuteCount: convertToCommuteCountFromRemote(param),
      isSummaryLocked,
      useFixDailyRequest,
    });
  }

  /**
   * 日タイプ
   * - WORKDAY: 勤務日
   * - HOLIDAY: 休日
   * - LEGAL_HOLIDAY: 法定休日
   * @type {Object<String, String>}
   */
  static DAY_TYPE = {
    WORKDAY: 'Workday',
    HOLIDAY: 'Holiday',
    LEGAL_HOLIDAY: 'LegalHoliday',
    PREFERRED_LEGAL_HOLIDAY: 'PreferredLegalHoliday',
  } as const;
}
