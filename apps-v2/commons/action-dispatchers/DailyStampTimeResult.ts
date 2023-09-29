import { IDailyStampTimeRepository } from '@attendance/domain/models/DailyStampTime';

import { AppDispatch } from '../modules/AppThunk';

import * as DailyAttAddProcessActions from './AttDailyInsufficientRestTime';

/**
 * 不足している休憩時間を補完するかダイアログで確認する
 *
 */
// eslint-disable-next-line import/prefer-default-export
export const confirmToComplementInsufficientingRestTime =
  (result?: PromiseType<ReturnType<IDailyStampTimeRepository['post']>>) =>
  (dispatch: AppDispatch) => {
    if (!result || Number(result.insufficientRestTime) <= 0) {
      return null;
    }

    return dispatch(
      DailyAttAddProcessActions.confirmToComplementInsufficientingRestTime({
        insufficientRestTime: Number(result.insufficientRestTime),
      })
    );
  };
