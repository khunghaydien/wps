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
  forwardCount: number;
  // 通勤復路回数
  backwardCount: number;
};

/**
 * 通勤往路回数と通勤復路回数から通勤状態を返します
 */
export const toCommuteState = (commuteCount: CommuteCount): CommuteState => {
  if (!commuteCount) {
    return;
  }
  const { forwardCount, backwardCount } = commuteCount;
  if (forwardCount === null && backwardCount === null) {
    return COMMUTE_STATE.UNENTERED;
  } else if (forwardCount === 0 && backwardCount === 0) {
    return COMMUTE_STATE.NONE;
  } else if (forwardCount >= 1 && backwardCount === 0) {
    return COMMUTE_STATE.FORWARD;
  } else if (forwardCount === 0 && backwardCount >= 1) {
    return COMMUTE_STATE.BACKWARD;
  } else if (forwardCount && backwardCount) {
    return COMMUTE_STATE.BOTH_WAYS;
  }
};

/**
 * 通勤状態から通勤往路回数と通勤復路回数を返します
 */
export const toCommuteCount = (commuteState: CommuteState): CommuteCount => {
  switch (commuteState) {
    case COMMUTE_STATE.UNENTERED:
      return { forwardCount: null, backwardCount: null };
    case COMMUTE_STATE.NONE:
      return { forwardCount: 0, backwardCount: 0 };
    case COMMUTE_STATE.FORWARD:
      return { forwardCount: 1, backwardCount: 0 };
    case COMMUTE_STATE.BACKWARD:
      return { forwardCount: 0, backwardCount: 1 };
    case COMMUTE_STATE.BOTH_WAYS:
      return { forwardCount: 1, backwardCount: 1 };
  }
};

/**
 * 通勤回数の並び順
 */
export const ORDER_OF_COMMUTE_STATE = [
  COMMUTE_STATE.UNENTERED,
  COMMUTE_STATE.NONE,
  COMMUTE_STATE.BOTH_WAYS,
  COMMUTE_STATE.FORWARD,
  COMMUTE_STATE.BACKWARD,
];
