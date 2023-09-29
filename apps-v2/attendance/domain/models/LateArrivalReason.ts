import { LateArrivalRequest } from './AttDailyRequest/LateArrivalRequest';

export type LateArrivalReason = {
  id: string; // 遅刻理由id
  code: string; // 遅刻理由コード
  name: string; // 遅刻理由名
};

export const getDefaultLateArrivalReason = (
  lateArrivalReasonList: LateArrivalReason[],
  reasonId: string | null
): LateArrivalReason | null => {
  return (
    lateArrivalReasonList.find(
      (lateArrivalReason) => lateArrivalReason.id === reasonId
    ) ||
    lateArrivalReasonList[0] ||
    null
  );
};

export const createFromLateArrivalRequest = (
  request: LateArrivalRequest
): LateArrivalReason => ({
  id: request.reasonId,
  name: request.reasonName,
  code: request.reasonCode,
});

export type ILateArrivalReasonRepository = {
  fetchList: (param: {
    targetDate: string;
    employeeId?: string;
  }) => Promise<LateArrivalReason[]>;
};
