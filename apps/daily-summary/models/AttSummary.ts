/**
 * [Entity] 勤怠サマリー
 */
export default class AttSummary {
  [x: string]: any;

  constructor(param) {
    /**
     * 勤怠サマリーID
     * @type {String}
     */
    this.id = param.id;

    /**
     * 勤務確定申請ID
     * @type {String}
     */
    this.requestId = param.requestId;

    /**
     * 確定申請のステータス
     * @type {String}
     */
    this.status = param.status;

    /**
     * 承認者01の名前
     */
    this.approver01Name = param.approver01Name;

    /**
     * ロックフラグ
     * @type {Boolean}
     */
    this.isLocked = param.isLocked;

    /**
     * 全期間休職休業フラグ
     * @type {Boolean}
     */
    this.isAllLeaveOfAbsence = param.isAllLeaveOfAbsence;

    /**
     * 確定申請に関して実行可能な操作 ※後続の自己移譲で初期化する
     * @type {String}
     */
    this.performableActionForFix = null;

    this.setPerformableActionForFix();
  }

  /**
   * 確定申請に関して実行可能な操作を、申請の状態に基づいて設定する
   * @private
   */
  setPerformableActionForFix() {
    switch (this.status) {
      // 「承認申請」が実行可能
      case AttSummary.STATUS.NotRequested:
      case AttSummary.STATUS.Recalled:
      case AttSummary.STATUS.Rejected:
      case AttSummary.STATUS.Canceled:
        this.performableActionForFix = AttSummary.ACTIONS_FOR_FIX.Submit;
        break;

      // 「申請取消」が実行可能
      case AttSummary.STATUS.Pending:
        this.performableActionForFix = AttSummary.ACTIONS_FOR_FIX.CancelRequest;
        break;

      // 「承認取消」が実行可能
      case AttSummary.STATUS.Approved:
        this.performableActionForFix =
          AttSummary.ACTIONS_FOR_FIX.CancelApproval;
        break;

      // 何もできない
      default:
        this.performableActionForFix = AttSummary.ACTIONS_FOR_FIX.None;
    }
  }

  /**
   * @param {String} id 勤怠サマリーID
   * @param {String} requestId 勤務確定申請ID
   * @param {String} status
   * @param {Boolean} isLocked
   * @param {Boolean} isAllLeaveOfAbsence
   * @return {AttSummary}
   */
  static createFromParam({
    id,
    requestId,
    status,
    approver01Name,
    isLocked,
    isAllLeaveOfAbsence,
  }) {
    return new AttSummary({
      id,
      requestId,
      status,
      approver01Name,
      isLocked,
      isAllLeaveOfAbsence,
    });
  }

  /**
   * - NotRequested - 未申請
   * - Pending - 承認待ち
   * - Approved - 承認済み
   * - Rejected - 却下
   * - Removed - 申請取消
   * - Canceled - 承認取消
   * @type {Object<String, String>}
   */
  static STATUS = {
    NotRequested: 'NotRequested',
    Pending: 'Pending',
    Approved: 'Approved',
    Rejected: 'Rejected',
    Recalled: 'Removed',
    Canceled: 'Canceled',
  };

  /**
   * 確定申請に関して実行可能な操作
   * - Submit: 承認申請
   * - CancelRequest: 申請取り消し
   * - CancelApproval: 承認取り消し
   * - None: 何もない
   * @type {Object<String, String>}
   */
  static ACTIONS_FOR_FIX = {
    Submit: 'Submit',
    CancelRequest: 'CancelRequest',
    CancelApproval: 'CancelApproval',
    None: 'None',
  };
}
