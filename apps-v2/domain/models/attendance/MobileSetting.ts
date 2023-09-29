export type MobileSetting = {
  /**
   * 打刻時の位置情報を送信する
   */
  requireLocationAtMobileStamp: boolean;
  /**
   * 通勤回数管理を使用するか否か
   */
  useManageCommuteCountAtMobileStamp: boolean;
  /**
   * 通勤往路回数のデフォルト値
   */
  defaultCommuteForwardCount: number;
  /**
   * 通勤復路回数のデフォルト値
   */
  defaultCommuteBackwardCount: number;
};
