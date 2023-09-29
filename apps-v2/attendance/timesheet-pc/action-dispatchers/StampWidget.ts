import * as dailyStampTimeResultActions from '../../../commons/action-dispatchers/DailyStampTimeResult';
import * as commonActions from '../../../commons/actions/app';
import { AppDispatch } from '../../../commons/modules/AppThunk';

import DailyStampTimeRepository from '@attendance/repositories/DailyStampTimeRepository';

import {
  CLOCK_TYPE,
  EditingDailyStampTime,
  MODE_TYPE,
  ModeType,
  STAMP_SOURCE,
} from '@attendance/domain/models/DailyStampTime';

import { actions as stampWidgetActions } from '../modules/entities/stampWidget';

const MODE_TYPE_MAP = {
  [MODE_TYPE.CLOCK_IN]: CLOCK_TYPE.IN,
  [MODE_TYPE.CLOCK_OUT]: CLOCK_TYPE.OUT,
  [MODE_TYPE.CLOCK_REIN]: CLOCK_TYPE.REIN,
};

/**
 * 打刻情報を取得する
 */
export const initDailyStampTime = () => (dispatch: AppDispatch) => {
  return DailyStampTimeRepository.fetch()
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

    const commonPostProcess = () =>
      DailyStampTimeRepository.post({
        clockType: MODE_TYPE_MAP[stampWidget.mode],
        comment: stampWidget.message,
        source: STAMP_SOURCE.WEB,
      });
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
export const switchModeType =
  (clockType: ModeType) => (dispatch: AppDispatch) => {
    dispatch(stampWidgetActions.switchModeType(clockType));
  };

/**
 * メッセージを更新する
 * @param {String} message
 * @returns {{type: String, payload: Object}}
 */
export const updateMessage = (message: string) => (dispatch: AppDispatch) => {
  dispatch(stampWidgetActions.updateMessage(message));
};
