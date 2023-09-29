import { Record } from '@apps/timesheet-pc-summary/models/Record';

export const COMMUTE_STATE = {
  UNENTERED: 'Unentered',
  NONE: 'None',
  FORWARD: 'Forward',
  BACKWARD: 'Backward',
  BOTH_WAYS: 'BothWays',
} as const;

export type CommuteState = typeof COMMUTE_STATE[keyof typeof COMMUTE_STATE];

export type CommuteCount = {
  // 通勤往路回数
  commuteForwardCount: number;
  // 通勤復路回数
  commuteBackwardCount: number;
};

/**
 * 通勤往路回数と通勤復路回数から通勤状態を返します
 */
export const toCommuteState = (
  commuteForwardCount: number,
  commuteBackwardCount: number
): CommuteState => {
  if (commuteForwardCount === null && commuteBackwardCount === null) {
    return COMMUTE_STATE.UNENTERED;
  } else if (commuteForwardCount === 0 && commuteBackwardCount === 0) {
    return COMMUTE_STATE.NONE;
  } else if (commuteForwardCount >= 1 && commuteBackwardCount === 0) {
    return COMMUTE_STATE.FORWARD;
  } else if (commuteForwardCount === 0 && commuteBackwardCount >= 1) {
    return COMMUTE_STATE.BACKWARD;
  } else if (commuteForwardCount && commuteBackwardCount) {
    return COMMUTE_STATE.BOTH_WAYS;
  }
};

/**
 * 通勤状態から通勤往路回数と通勤復路回数を返します
 */
export const toCommuteCount = (
  commuteState: CommuteState
): [number, number] => {
  switch (commuteState) {
    case COMMUTE_STATE.UNENTERED:
      return [null, null];
    case COMMUTE_STATE.NONE:
      return [0, 0];
    case COMMUTE_STATE.FORWARD:
      return [1, 0];
    case COMMUTE_STATE.BACKWARD:
      return [0, 1];
    case COMMUTE_STATE.BOTH_WAYS:
      return [1, 1];
  }
};

/**
 * 勤怠サマリー表示用
 * 通勤回数管理を使わない勤務体系の時、勤怠サマリーの通勤往路回数・通勤復路回数に入れられる数字
 */
const CAN_NOT_USE_MANEGE_COMMUTE_COUNT = 99;

/**
 * 勤怠サマリー表示用
 * 通勤列を表示できるかどうかを返します
 */
export const canShowCommuteColumn = (attRecords: Record[]): boolean =>
  !(
    attRecords[0]?.commuteCountForward === CAN_NOT_USE_MANEGE_COMMUTE_COUNT &&
    attRecords[0]?.commuteCountBackward === CAN_NOT_USE_MANEGE_COMMUTE_COUNT
  );

/**
 * 指定した日付の勤怠明細が存在しない時、日毎通勤回数取得APIのレスポンスの通勤往路回数・通勤復路回数に入れられる数字
 */
const NOT_HAVE_COMMUTE_COUNT = -1;

/**
 * 日毎通勤回数取得APIのレスポンスを見て、通勤回数が取得できているかどうかを返します
 */
export const existRecordWithCommuteCount = (
  commuteCount: CommuteCount
): boolean =>
  !(
    commuteCount.commuteForwardCount === NOT_HAVE_COMMUTE_COUNT &&
    commuteCount.commuteBackwardCount === NOT_HAVE_COMMUTE_COUNT
  );
