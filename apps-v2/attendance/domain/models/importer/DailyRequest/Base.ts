import { Status } from '@attendance/domain/models/AttDailyRequest';

export type Base = {
  // 申請ID
  id: string;

  // 申請種別名
  requestTypeName: string;

  // 申請ステータス
  status: Status;
};
