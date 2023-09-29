export type ApprovalStatus = Readonly<{
  NotRequested: 'NotRequested';
  /**
   * 申請中
   */
  Pending: 'Pending';
  /**
   * 申請取消
   */
  Recalled: 'Removed';
  /**
   * 却下
   */
  Rejected: 'Rejected';
  /**
   * 承認待ち
   */
  ApprovalIn: 'Approval In';
  /**
   * 承認済み
   */
  Approved: 'Approved';
  /**
   * 承認取消
   */
  Canceled: 'Canceled';
  /**
   * 承認内容変更承認待ち
   */
  Reapplying: 'Reapplying';
  /**
   *  承認済み事前申請
   */
  ApprovedPreRequest: 'ApprovedPreRequest';
}>;

export type Status = ApprovalStatus[keyof ApprovalStatus];

declare const STATUS: ApprovalStatus;
export default STATUS;

export declare const ORDER_OF_STATUS: [
  ApprovalStatus['Canceled'],
  ApprovalStatus['Rejected'],
  ApprovalStatus['Recalled'],
  ApprovalStatus['ApprovalIn'],
  ApprovalStatus['Approved']
];
