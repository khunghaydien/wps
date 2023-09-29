import DateUtil from '../../commons/utils/DateUtil';
import TimeUtil from '../../commons/utils/TimeUtil';

/**
 * [Entity] 日次勤怠明細（＋申請情報・備考など）
 */
export default class AttRecord {
  [x: string]: any;

  /**
   * @param {Object} param
   */
  constructor(param) {
    // APIレスポンスそのままのフィールド

    /**
     * 勤怠日次明細ID
     * @type {String}
     */
    this.id = param.id;

    /**
     * 日付(YYYY-MM-DD形式の文字列)
     * @type {String}
     */
    this.recordDate = param.recordDate;

    /**
     * 日タイプ(AttDayType（グローバル選択リスト）の値)
     * @type {String}
     */
    this.dayType = param.dayType;

    /**
     * 出勤時刻
     * @type {Number}
     */
    this.startTime = param.startTime;

    /**
     * 退勤時刻
     * @type {Number}
     */
    this.endTime = param.endTime;

    /**
     * 出勤打刻時刻
     * @type {Number}
     */
    this.startStampTime = param.startStampTime;

    /**
     * 退勤打刻時刻
     * @type {Number}
     */
    this.endStampTime = param.endStampTime;

    /**
     * 実効出勤時間
     */
    this.outStartTime = param.outStartTime;

    /**
     * 実効退勤時間
     */
    this.outEndTime = param.outEndTime;

    /**
     * 休憩1開始時刻
     * @type {Number}
     */
    this.rest1StartTime = param.rest1StartTime;

    /**
     * 休憩1終了時刻
     * @type {Number}
     */
    this.rest1EndTime = param.rest1EndTime;

    /**
     * 休憩2開始時刻
     * @type {Number}
     */
    this.rest2StartTime = param.rest2StartTime;

    /**
     * 休憩2終了時刻
     * @type {Number}
     */
    this.rest2EndTime = param.rest2EndTime;

    /**
     * 休憩3開始時刻
     * @type {Number}
     */
    this.rest3StartTime = param.rest3StartTime;

    /**
     * 休憩3終了時刻
     * @type {Number}
     */
    this.rest3EndTime = param.rest3EndTime;

    /**
     * 休憩4開始時刻
     * @type {Number}
     */
    this.rest4StartTime = param.rest4StartTime;

    /**
     * 休憩4終了時刻
     * @type {Number}
     */
    this.rest4EndTime = param.rest4EndTime;

    /**
     * 休憩5開始時刻
     * @type {Number}
     */
    this.rest5StartTime = param.rest5StartTime;

    /**
     * 休憩5終了時刻
     * @type {Number}
     */
    this.rest5EndTime = param.rest5EndTime;

    /**
     * その他の休憩時間
     * @type {Number}
     */
    this.restHours = param.restHours;

    /**
     * 備考
     * @type {String}
     */
    this.remarks = param.remarks;

    /**
     * 申請可能な勤怠申請タイプコード一覧
     * @type {Array<String>}
     */
    this.requestTypeCodes = param.requestTypeCodes;

    /**
     * 申請済みの勤怠申請ID一覧
     * @type {Array<String>}
     */
    this.requestIds = param.requestIds;

    /**
     * 勤務所定情報
     * @type {DailyContractedDetail}
     */
    this.contractedDetail = param.contractedDetail;

    /**
     * 所定内法定内勤務時間帯
     * @type {Array<Object>}
     */
    this.ciliTimePeriods = param.ciliTimePeriods;

    /**
     * 所定内法定外勤務時間帯
     * @type {Array<Object>}
     */
    this.ciloTimePeriods = param.ciloTimePeriods;

    /**
     * 所定外法定内勤務時間帯
     * @type {Array<Object>}
     */
    this.coliTimePeriods = param.coliTimePeriods;

    /**
     * 所定外法定外勤務時間帯
     * @type {Array<Object>}
     */
    this.coloTimePeriods = param.coloTimePeriods;

    /**
     * 承認者
     */
    this.approver01Name = param.approver01Name;

    /**
     * 日次確定による日次にロック状態のフラグ
     * - 開発予定の日次確定を想定した実装。日次確定に対応する際に、妥当か再確認する
     * @type {Boolean}
     * @private
     */
    this.isLocked = param.isLocked;

    /**
     * 月次確定によるサマリー全体のロック状態のフラグ
     * @type {Boolean}
     * @private
     */
    this.isSummaryLocked = param.isSummaryLocked;

    /**
     * 休職・休業中かどうかのフラグ
     * @type {Boolean}
     */
    this.isLeaveOfAbsence = param.isLeaveOfAbsence;

    /**
     * 不足休憩時間
     * @type {Number}
     */
    this.insufficientRestTime = param.insufficientRestTime;

    /**
     * 月次と日次にもとづくロックフラグ ※後続の自己移譲で初期化する
     * @type {Boolean}
     */
    this.isTotallyLocked = null;

    /**
     * 勤怠の記録を持つか否かのフラグ ※後続の自己移譲で初期化する
     * @type {Boolean}
     */
    this.hasActualWorkingTimes = null;

    /**
     * 実労働時間を表現できるか（グラフとして） ※後続の自己移譲で初期化する
     * @type {Boolean}
     */
    this.isActualWorkingTimeRepresentable = false;

    /**
     * その他休憩時間を表示するかしないか
     * @type {Boolean}
     */
    this.hasRestTime = !!(this.restHours + this.insufficientRestTime);

    this.setTotallyLockStatus();
    this.setPossessionOfActualWorkingTimes();
    this.setRepresentabilityOfActualWorkingTime();

    // NOTE:
    // 以下のコードは本来View（presentational-component）側の処理にすべきだが、
    // 下記の問題によりこちらに記述している。
    // * 勤怠時間グラフのドラッグ操作にパフォーマンス面の悪影響があるためrender内は不適
    // * ComponentのLifecycleメソッド内で判定するにしても、やはりパフォーマンス劣化が懸念される
    // TODO: パフォーマンスを計測しながら適した記述場所を探る

    /**
     * ［表示用］日付
     * @type {Number}
     */
    this.displayDate = DateUtil.getDate(this.recordDate);

    /**
     * ［表示用］曜日
     * @type {String}
     */
    this.displayDay = DateUtil.formatWeekday(this.recordDate);

    /**
     * ［表示用］出勤時刻
     * @type {String}
     */
    this.displayStartTime = TimeUtil.toHHmm(this.startTime);

    /**
     * ［表示用］退勤時刻
     * @type {String}
     */
    this.displayEndTime = TimeUtil.toHHmm(this.endTime);
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
  static createFromParam(param, isSummaryLocked) {
    return new AttRecord({
      ...param,
      isSummaryLocked,
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
  };
}
