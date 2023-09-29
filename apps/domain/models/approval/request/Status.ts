import { $ReadOnly, $Values } from 'utility-types';

export type ApprovalStatus = $ReadOnly<{
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
  /**
   * Claimed
   */
  Claimed: 'Claimed';

  /**
   * Discarded
   */
  Discarded: 'Discarded';
}>;

export type Status = $Values<ApprovalStatus>;

const STATUS: ApprovalStatus = {
  NotRequested: 'NotRequested',

  /**
   * 申請中
   */
  Pending: 'Pending',

  /**
   * 申請取消
   */
  Recalled: 'Removed',

  /**
   * 却下
   */
  Rejected: 'Rejected',

  /**
   * 承認待ち
   */
  ApprovalIn: 'Approval In',

  /**
   * 承認済み
   */
  Approved: 'Approved',

  /**
   * 承認取消
   */
  Canceled: 'Canceled',

  /**
   * 承認内容変更承認待ち
   */
  Reapplying: 'Reapplying',

  /**
   *  承認済み事前申請
   */
  ApprovedPreRequest: 'ApprovedPreRequest',

  /** Claimed */
  Claimed: 'Claimed',

  /** Discarded */
  Discarded: 'Discarded',
};

export const ORDER_OF_STATUS = [
  STATUS.Canceled,
  STATUS.Rejected,
  STATUS.Recalled,
  STATUS.ApprovalIn,
  STATUS.Approved,
];

export default STATUS;
