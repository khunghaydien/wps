import Base from './Base';

export default class ApprovalHistoryList extends Base {
  /**
   *  経費申請の承認履歴を取得する
   */
  fetchExpReportApprovalHistoryList(state, expReportId, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .get(
          this
            .encodedURI`/restproxy-pc/getExpReportApprovalHistoryList?expReportId=${expReportId}`
        )
        .then((result) => {
          if (result.error) {
            throw result;
          }
          callback(result);
        })
        .catch((err) => {
          console.error(err);
          // TODO: dispatch Error
        });
    });
  }

  /**
   *  事前申請の承認履歴を取得する
   */
  fetchTepApprovalApprovalHistoryList(state, tepApprovalId, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .get(
          this
            .encodedURI`/restproxy-pc/getTepApprovalApprovalHistoryList?tepApprovalId=${tepApprovalId}`
        )
        .then((result) => {
          if (result.error) {
            throw result;
          }
          callback(result);
        })
        .catch((err) => {
          console.error(err);
          // TODO: dispatch Error
        });
    });
  }
}
