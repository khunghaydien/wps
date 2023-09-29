import { ReactNode } from 'react';

import { ApprovalHistoryList } from '../request/History';
import { Status as ApprovalStatus } from '../request/Status';

/**
 * The base type of daily requests
 *
 * API で返却される申請の共通部分
 */
export type BaseAttDailyDetail = {
  id: string;
  status: ApprovalStatus | '';
  employeeName: string;
  employeePhotoUrl: string;
  delegatedEmployeeName: string | null | undefined;
  comment: string | null | undefined; // NOTE unimplementend and unused.
  // type: string, // request type
  typeLabel: string; // label of r request type
  remarks: string | null | undefined;
};

/**
 * The base type returned by API
 *
 * API で返却されるデータのベース type
 */
export type AttDailyDetailBaseFromApi<TRequest> = {
  request: BaseAttDailyDetail & TRequest;
  originalRequest?: BaseAttDailyDetail & TRequest;
} & ApprovalHistoryList;

/**
 * The base type saved into Redux Store
 *
 * Store に保存する申請の共通部分
 */
export type BaseAttDailyDetailForStore = {
  id: string; // 申請ID
  status: ApprovalStatus | ''; // 申請ステータス
  employeeName: string; // 申請者名
  employeePhotoUrl: string; // 申請者顔写真URL
  delegatedEmployeeName: string | null | undefined; // 代理申請者名
  comment?: string | null | undefined; // 申請時コメント（未実装、未使用）
  // type: string, // 申請種別 // 各タイプで定義
  typeLabel: string; // 申請種別（表示用）
  remarks: string | null | undefined; // 備考
};

/**
 * The base type saved into Redux Store
 *
 * Store に保存するデータのベース type
 */
export type AttDailyDetailBaseForStore<TRequest> = {
  request: BaseAttDailyDetailForStore & TRequest;
  originalRequest?: BaseAttDailyDetailForStore & TRequest;
} & ApprovalHistoryList;

/**
 * The latest request
 */
export type Request<T extends { request: unknown }> = T['request'];

/**
 * The orignal request
 */
export type OriginalRequest<T extends { originalRequest: unknown }> =
  T['originalRequest'];

/**
 * ラベルタイプ
 */
export type Label = {
  label: string;
  value: number | string | ReactNode;
  valueType?: 'date' | 'datetime' | 'text' | 'longtext';
  originalValue?: number | string;
};

/**
 * ラベルタイプの配列
 */
export type ArrayLabel = Array<Label>;
