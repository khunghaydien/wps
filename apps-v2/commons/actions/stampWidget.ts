export const ACTIONS = {
  APPLY_DAILY_STAMP_TIME: 'COMMONS/STAMP_WIDGET/APPLY_DAILY_STAMP_TIME',
  SWITCH_MODE: 'COMMONS/STAMP_WIDGET/SWITCH_MODE',
  UPDATE_MESSAGE: 'COMMONS/STAMP_WIDGET/UPDATE_MESSAGE',
  BLOCK_OPERATION: 'COMMONS/STAMP_WIDGET/BLOCK_OPERATION',
};

/**
 * 打刻情報を適用する
 * @param {Object} dailyStampTime APIレスポンス値
 * @returns {{type: String, payload: Object}}
 */
export const applyDailyStampTime = (dailyStampTime) => ({
  type: ACTIONS.APPLY_DAILY_STAMP_TIME,
  payload: dailyStampTime,
});

/**
 * 出勤・退勤を切り替える
 * @param {String} clockType
 * @returns {{type: String, payload: Object}}
 */
export const switchClockType = (clockType) => ({
  type: ACTIONS.SWITCH_MODE,
  payload: clockType,
});

/**
 * メッセージを更新する
 * @param {String} message
 * @returns {{type: String, payload: Object}}
 */
export const updateMessage = (message) => ({
  type: ACTIONS.UPDATE_MESSAGE,
  payload: message,
});

/**
 * ユーザー操作を防止する
 * @returns {{type: string}}
 */
export const blockOperation = () => ({
  type: ACTIONS.BLOCK_OPERATION,
});
