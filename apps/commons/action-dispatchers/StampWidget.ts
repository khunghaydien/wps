import {
  ClockType,
  EditingDailyStampTime,
  fetchDailyStampTime,
  postStamp,
  PostStampRequest,
  STAMP_SOURCE,
} from '../../domain/models/attendance/DailyStampTime';

import { AppDispatch } from '../modules/AppThunk';

import * as commonActions from '../actions/app';
import * as stampWidgetActions from '../actions/stampWidget';

import * as dailyStampTimeResultActions from './DailyStampTimeResult';

/**
 * 打刻情報を取得する
 */
export const initDailyStampTime = () => (dispatch: AppDispatch) => {
  return fetchDailyStampTime()
    .then((result) => {
      // 打刻情報を適用する
      dispatch(stampWidgetActions.applyDailyStampTime(result));
    })
    .catch((err) =>
      dispatch(commonActions.catchApiError(err, { isContinuable: true }))
    );
};

/**
 * 打刻を実行（送信）する
 */
export const submitStamp =
  (
    stampWidget: EditingDailyStampTime,
    options:
      | {
          withGlobalLoading?: boolean;
          onStampSuccess?: () => void;
        }
      | null
      | undefined
  ) =>
  (dispatch: AppDispatch) => {
    // NOTE: 本来発生しえない／mode未定だと打刻ボタンが非活性なので
    if (stampWidget.mode === null || stampWidget.mode === undefined) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject();
    }

    const { withGlobalLoading, onStampSuccess } = options || {};

    const postParams: PostStampRequest = {
      mode: stampWidget.mode,
      comment: stampWidget.message,
    };

    const commonPostProcess = () => postStamp(postParams, STAMP_SOURCE.WEB);
    const postProcess = withGlobalLoading
      ? commonActions.withLoading(commonPostProcess)
      : commonPostProcess;

    // ユーザー操作を防止する
    dispatch(stampWidgetActions.blockOperation());

    return dispatch(postProcess)
      .then((result) =>
        dispatch(
          dailyStampTimeResultActions.confirmToComplementInsufficientingRestTime(
            result
          )
        )
      )
      .then(() => {
        if (onStampSuccess && onStampSuccess instanceof Function) {
          onStampSuccess();
        }
      })
      .catch((err) =>
        dispatch(commonActions.catchApiError(err, { isContinuable: true }))
      )
      .then(() => {
        dispatch(initDailyStampTime());
      });
  };

/**
 * 出勤・退勤を切り替える
 * @param {String} clockType
 */
export const switchClockType =
  (clockType: ClockType) => (dispatch: AppDispatch) => {
    dispatch(stampWidgetActions.switchClockType(clockType));
  };

/**
 * メッセージを更新する
 * @param {String} message
 * @returns {{type: String, payload: Object}}
 */
export const updateMessage = (message: string) => (dispatch: AppDispatch) => {
  dispatch(stampWidgetActions.updateMessage(message));
};
