import Base from './Base';

export default class ApprovalHistoryList extends Base {
  remoting: any;

  /**
   * 経費申請の承認履歴一覧を取得する
   */
  fetchExpReportApprovalHistoryList(state, expReportId, callback) {
    return this.remoting.getApprovalHistoryList(
      { expReportId },
      (result, event) => {
        if (event.status) {
          console.log('Response Payload fetchApprovalHistoryList:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }

  /**
   * 事前申請の承認履歴一覧を取得する
   */
  fetchTepApprovalApprovalHistoryList(state, tepApprovalId, callback) {
    return this.remoting.getApprovalHistoryList(
      { tepApprovalId },
      (result, event) => {
        if (event.status) {
          console.log('Response Payload fetchApprovalHistoryList:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }
}
