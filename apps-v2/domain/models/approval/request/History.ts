import Api from '../../../../commons/api';

export type ApprovalHistory = {
  /**
   * 履歴ID
   */
  id: string;

  /**
   * ステップ名
   */
  stepName: string;

  /**
   * 承認日時 MM の形式
   */
  approveTime: string;

  /**
   * 状況
   */
  status: string;

  /**
   * 状況（表示用）
   */
  statusLabel: string;

  /**
   * 割当先
   */
  approverName: string;

  /**
   * 承認者名
   */
  actorName: string;

  /**
   * 承認者顔写真URL
   */
  actorPhotoUrl: string;

  /**
   * コメント
   */
  comment: string;

  /**
   * 代理かどうか
   *
   * actorNameが代理「申請」者か代理「承認」者かどうかを示すフラグです。
   */
  isDelegated: boolean;

  actorId?: string;

  isPending?: boolean;
};

// 承認履歴
export type ApprovalHistoryList = { historyList: Array<ApprovalHistory> };

/* eslint-disable import/prefer-default-export */
export const getRequestApprovalHistory = (requestId: string) => {
  return Api.invoke({
    path: '/approval/request/history/get',
    param: {
      requestId,
    },
  }).then((res: ApprovalHistoryList) => res);
};
