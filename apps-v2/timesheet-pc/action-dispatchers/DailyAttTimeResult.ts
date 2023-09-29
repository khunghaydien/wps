import * as DailyAttAddProcessActions from '../../commons/action-dispatchers/AttDailyInsufficientRestTime';

import { UpdateResult as AttDailyTimeUpdateResult } from '../../repositories/attendance/AttDailyTimeRepository';

import { AppDispatch } from './AppThunk';

/**
 * 休憩時間が足りていない場合にダイアログを表示する
 */
// eslint-disable-next-line import/prefer-default-export
export const confirmToComplementInsufficientingRestTime =
  (
    targetDate: string | null | undefined,
    employeeId: string | null | undefined,
    result: AttDailyTimeUpdateResult
  ) =>
  (dispatch: AppDispatch) => {
    if (!result || Number(result.insufficientRestTime) <= 0) {
      return null;
    }

    return dispatch(
      DailyAttAddProcessActions.confirmToComplementInsufficientingRestTime({
        targetDate,
        employeeId,
        insufficientRestTime: Number(result.insufficientRestTime),
      })
    );
  };
