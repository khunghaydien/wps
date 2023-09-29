import { EarlyLeaveRequest } from './AttDailyRequest/EarlyLeaveRequest';

export type EarlyLeaveReason = {
  id: string; // 早退理由id
  code: string; // 早退理由コード
  name: string; // 早退理由名
  // コアなしフレックスの早退申請のみで使用する
  earlyLeaveEndTime: number | null; // 終了時間
};

export const getDefaultEarlyLeaveReason = (
  earlyLeaveReasonList: EarlyLeaveReason[],
  reasonId: string | null
): EarlyLeaveReason | null => {
  return (
    earlyLeaveReasonList.find(
      (earlyLeaveReason) => earlyLeaveReason.id === reasonId
    ) ||
    earlyLeaveReasonList[0] ||
    null
  );
};

/**
 * Domain サービスに移動する
 * @param request
 * @returns
 */
export const createFromEarlyLeaveRequest = (
  request: EarlyLeaveRequest
): EarlyLeaveReason => ({
  id: request?.reasonId,
  name: request?.reasonName,
  code: request?.reasonCode,
  earlyLeaveEndTime: request?.endTime,
});

export type IEarlyLeaveReasonRepository = {
  fetchList: (param: {
    targetDate: string;
    employeeId?: string;
  }) => Promise<EarlyLeaveReason[]>;
};
