import { isNil } from 'lodash';

import { compose } from '@commons/utils/FnUtil';

import { AttDailyRecord } from '../AttDailyRecord';
import { CODE } from '../AttDailyRequestType';
import {
  EarlyLeaveReason,
  getDefaultEarlyLeaveReason,
} from '../EarlyLeaveReason';
import * as Base from './BaseAttDailyRequest';

export const MAX_LENGTH_REASON = 255 as const;

/**
 * Early Leave Request
 * 早退申請
 */
export type EarlyLeaveRequest = Base.BaseAttDailyRequest & {
  type: typeof CODE.EarlyLeave;

  /**
   * Target Date
   * 開始日
   */
  startDate: string;

  /**
   * Start Time
   * elapsed minutes of day.
   *
   * 開始時間
   * その日の0:00を0とした分で表す時刻。
   */
  startTime: number | null;

  /**
   * End Time
   * elapsed minutes of day.
   *
   * 終了時間
   * その日の0:00を0とした分で表す時刻。
   */
  endTime: number | null;

  /**
   * Reason (max: 255 characters)
   * 理由 (最大: 255文字)
   */
  reason: string;

  /**
   * 労働時間制がコアなしフレックスフラグ
   */
  isFlexWithoutCore: boolean;

  /**
   * Personal Reason
   * 自己都合
   */
  personalReason: boolean;

  /**
   * @deprecated
   * 自責管理
   * useEarlyLeaveReason が true の場合は使用できない。必ず false になる。
   * BE が常に現在の勤務体系の値を返しているので今後は使用禁止
   */
  useManagePersonalReason: boolean;

  /**
   * 早退理由を管理するか否か
   */
  useEarlyLeaveReason: boolean;

  /**
   * 早退理由ID
   * useEarlyLeaveReason が false の場合 null である必要がある。空文字（""）はエラーになる。
   */
  reasonId: string;

  /**
   * 備考
   * useLateArrivalReason が true の場合に使用する。
   */
  remarks: string;
};

/**
 * Create EarlyLeaveRequest from AttDailyRequest.
 * BaseAttDailyRequest から EarlyLeaveRequest を作成します。
 */
export const formatAttDailyRequest = (
  request: Base.BaseAttDailyRequest
): EarlyLeaveRequest => ({
  isFlexWithoutCore: false,
  ...request,
  type: CODE.EarlyLeave,
});

/**
 * 合成関数作成用
 */
const defaultNothing = (request: EarlyLeaveRequest) => request;

/**
 * Set default start date
 *  開始日のデフォルト値の設定します。
 */
export const defaultStartDate =
  (targetDate: string | null) => (request: EarlyLeaveRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate };
  };

/**
 * 申請で使っているフラグの値を設定します。
 */
export const defaultFlagsByDailyRecord =
  (record: AttDailyRecord | null) => (request: EarlyLeaveRequest) => ({
    ...request,
    useManagePersonalReason: record.useManageEarlyLeavePersonalReason,
    isFlexWithoutCore: record.isFlexWithoutCore,
  });

/**
 * 理由（EarlyLeaveReason）を反映させます。
 */
export const defaultReasonId =
  (selectedEarlyLeaveReason: EarlyLeaveReason) =>
  (request: EarlyLeaveRequest) => ({
    ...request,
    reasonId: selectedEarlyLeaveReason?.id,
  });

/**
 * 理由IDを設定します
 */
export const defaultReasonIdByEarlyLeaveReasonList =
  (earlyLeaveReasons: EarlyLeaveReason[] | null) =>
  (request: EarlyLeaveRequest) => {
    if (!request.useEarlyLeaveReason) {
      return request;
    }
    const selectedEarlyLeaveReason = getDefaultEarlyLeaveReason(
      earlyLeaveReasons || [],
      request.reasonId
    );
    return defaultReasonId(selectedEarlyLeaveReason)(request);
  };

/**
 * 理由管理に必要な値を設定し直します。
 */
export const defaultManagedReasons =
  (useEarlyLeaveReason: boolean) =>
  (request: EarlyLeaveRequest): EarlyLeaveRequest => ({
    ...request,
    useEarlyLeaveReason,
    reasonId: useEarlyLeaveReason ? request?.reasonId : null,
    remarks: useEarlyLeaveReason ? request?.remarks : null,
  });

/**
 *  デフォルトの開始時間を設定します。
 */
export const defaultStartTimeByDailyRecord =
  (dailyRecord: AttDailyRecord) =>
  (request: EarlyLeaveRequest): EarlyLeaveRequest => ({
    ...request,
    startTime: dailyRecord?.endTime ?? request.startTime,
  });

/**
 *  理由管理で選択した値から退勤時間を取得します。
 */
export const defaultEndTimeByEarlyLeaveReason =
  (selectedEarlyLeaveReason: EarlyLeaveReason) =>
  (request: EarlyLeaveRequest): EarlyLeaveRequest => ({
    ...request,
    // コアなしフレックスの早退申請で理由管理を使う場合のみ理由から終業時間を取得する
    endTime:
      request.useEarlyLeaveReason && request.isFlexWithoutCore
        ? selectedEarlyLeaveReason?.earlyLeaveEndTime ?? request.endTime
        : request.endTime,
  });

/**
 *  理由管理で理由配列から選択した値から退勤時間を取得します。
 */
export const defaultEndTimeByEarlyLeaveReasons =
  (earlyLeaveReasons: EarlyLeaveReason[]) =>
  (request: EarlyLeaveRequest): EarlyLeaveRequest =>
    defaultEndTimeByEarlyLeaveReason(
      earlyLeaveReasons?.find(({ id }) => id === request.reasonId)
    )(request);

/**
 *  勤怠明細から退勤時間を取得します。
 */
export const defaultEndTimeByDailyRecord =
  (dailyRecord: AttDailyRecord) =>
  (request: EarlyLeaveRequest): EarlyLeaveRequest => ({
    ...request,
    endTime: getEndTimeByDailyRecord(request, dailyRecord),
  });

/**
 *  勤怠明細から退勤時間を取得します。
 */
export const getEndTimeByDailyRecord = (
  request: EarlyLeaveRequest,
  dailyRecord: AttDailyRecord
): number | null => {
  if (!dailyRecord) {
    return request.endTime;
  }

  const endTime = dailyRecord?.earlyLeaveEndTime ?? request?.endTime;

  // コアなしフレックスの早退申請でなければ退勤時間を返す
  if (!request?.isFlexWithoutCore) {
    return endTime;
  }

  // 出退勤で時間が確定されていない場合は入力された退勤時間を返す
  if (isNil(dailyRecord.startTime) || isNil(dailyRecord.endTime)) {
    return request.endTime;
  }

  // 自己都合の場合
  if (request.personalReason) {
    return dailyRecord?.personalReasonEarlyLeaveEndTime;
  }

  // 自己都合管理を私用している場合
  if (request.useManagePersonalReason) {
    return dailyRecord?.objectiveReasonEarlyLeaveEndTime;
  }

  // その他の場合
  return dailyRecord?.personalReasonEarlyLeaveEndTime;
};

/**
 * EarlyLeaveRequestを更新します。
 * この関数を通さないと Object を正しく更新できません。
 * ただ、Domain Model にあるべきものではないので Service に移動する予定です。
 *
 * FIXME: 機能を壊す要素が強いので Unit テストを作りたい
 */
export const update =
  ({
    dailyRecord: record,
    earlyLeaveReasons: reasons,
  }: {
    dailyRecord: AttDailyRecord;
    earlyLeaveReasons: EarlyLeaveReason[];
  }) =>
  (
    request: EarlyLeaveRequest,
    key: keyof EarlyLeaveRequest,
    value: EarlyLeaveRequest[typeof key]
  ): EarlyLeaveRequest =>
    compose(
      defaultEndTimeByEarlyLeaveReasons(reasons),
      defaultEndTimeByDailyRecord(record),
      key === 'reasonId'
        ? defaultReasonIdByEarlyLeaveReasonList(reasons)
        : defaultNothing
    )({
      ...request,
      [key]: value,
    });

/**
 * 申請を作成します。
 * 表示用に使用することを想定しています。
 * Domain Model にあるべきものではないので Service に移動する予定です。
 */
export const create = (
  request: Base.BaseAttDailyRequest,
  targetDate: string | null = null
): EarlyLeaveRequest =>
  compose(
    defaultStartDate(targetDate),
    defaultManagedReasons(!!request.reasonId),
    formatAttDailyRequest
  )(request);

/**
 * 申請を編集用に変換します。
 * 新規・既存申請で使用することを想定しています。
 * Domain Model にあるべきものではないので Service に移動する予定です。
 */
export const convertForEditing = (
  request: EarlyLeaveRequest,
  {
    dailyRecord,
    earlyLeaveReasons,
    useEarlyLeaveReason,
  }: {
    dailyRecord: AttDailyRecord;
    earlyLeaveReasons: EarlyLeaveReason[];
    useEarlyLeaveReason: boolean;
  }
): EarlyLeaveRequest => {
  return compose(
    defaultEndTimeByEarlyLeaveReasons(earlyLeaveReasons),
    defaultEndTimeByDailyRecord(dailyRecord),
    defaultStartTimeByDailyRecord(dailyRecord),
    // 新規作成の時だけ実行する
    request.id
      ? defaultNothing
      : defaultReasonIdByEarlyLeaveReasonList(earlyLeaveReasons),
    defaultManagedReasons(useEarlyLeaveReason),
    defaultFlagsByDailyRecord(dailyRecord)
  )(request);
};
