export type JobHistory = {
  /**
   * ジョブ履歴ID
   */
  id: string;

  /**
   * ジョブベースID
   */
  baseId: string;

  /**
   * ジョブコード
   */
  code: string;

  /**
   * ジョブ名
   */
  name: string;

  /**
   * Whether jot has parent or not.
   */
  hasJobType: boolean;

  /**
   * Whether jot has child level or not.
   */
  hasChildren: boolean;

  /**
   * 直課か否か
   */
  isDirectCharged: boolean;

  /**
   * ジョブ履歴有効開始日
   */
  validFrom: string;

  /**
   * ジョブ履歴有効開始日
   */
  validTo: string;

  /**
   * ジョブがロックされているかどうか
   */
  isEditLocked: boolean;
};
