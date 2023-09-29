import { actions as DailyAttentionsActions } from '../modules/ui/dailyAttentions';

import { AppDispatch } from './AppThunk';

/**
 * 警告ダイアログを開きます。
 * @param {Array<string>} messages 表示したいメッセージ一覧
 */
export const showDailyAttentionsDialog =
  (messages: Array<string>) => (dispatch: AppDispatch) => {
    dispatch(DailyAttentionsActions.set(messages));
  };

/**
 * 警告ダイアログを閉じます。
 */
export const hideDailyAttentionsDialog = () => (dispatch: AppDispatch) => {
  dispatch(DailyAttentionsActions.unset());
};
