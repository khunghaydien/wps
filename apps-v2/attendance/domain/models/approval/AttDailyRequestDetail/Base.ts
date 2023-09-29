import { ReactNode } from 'react';

import { ApprovalHistoryList } from '@apps/domain/models/approval/request/History';
import { STATUS, Status } from '@attendance/domain/models/AttDailyRequest';

export { STATUS };
export type { Status };

/**
 * The base request type
 */
export type BaseAttDailyRequest = {
  id: string; // 申請ID
  status: Status | ''; // 申請ステータス
  employeeName: string; // 申請者名
  employeePhotoUrl: string; // 申請者顔写真URL
  delegatedEmployeeName: string | null | undefined; // 代理申請者名
  comment?: string | null | undefined; // 申請時コメント（未実装、未使用）
  // type: string, // 申請種別 // 各タイプで定義
  typeLabel: string; // 申請種別（表示用）
  remarks: string | null | undefined; // 備考
};

/**
 * The base request detail type
 */
export type BaseAttDailyRequestDetail<TRequest> = {
  request: BaseAttDailyRequest & TRequest;
  originalRequest?: BaseAttDailyRequest & TRequest;
} & ApprovalHistoryList;

/**
 * The latest request
 */
export type Request<T extends { request: unknown }> = T['request'];

/**
 * The original request
 */
export type OriginalRequest<T extends { originalRequest: unknown }> =
  T['originalRequest'];

/**
 * ラベルタイプ
 */
export type Label = {
  label: string;
  // FIXME: Should not use ReactNode in domain.
  value: number | string | ReactNode;
  valueType?: 'date' | 'datetime' | 'text' | 'longtext';
  originalValue?: number | string;
};

/**
 * ラベルタイプの配列
 */
export type ArrayLabel = Array<Label>;

export { CODE as REQUEST_TYPE } from '@attendance/domain/models/AttDailyRequestType';
