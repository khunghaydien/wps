import * as DailyRestTimeFill from '../../domain/models/attendance/DailyRestTimeFill';

import { AppDispatch } from '../modules/AppThunk';

import * as commonActions from '../actions/app';

import AskInsufficientRestTime from '../components/dialogs/confirm/AskInsufficientRestTime';

/**
 * 不足している休憩時間を補完するかダイアログで確認して実行する
 *
 */
// eslint-disable-next-line import/prefer-default-export
export const confirmToComplementInsufficientingRestTime =
  ({
    employeeId,
    targetDate,
    insufficientRestTime,
  }: {
    employeeId?: string;
    targetDate?: string;
    insufficientRestTime: number;
  }) =>
  async (dispatch: AppDispatch): Promise<boolean | null> => {
    if (insufficientRestTime <= 0) {
      return null;
    }

    const result = await dispatch(
      commonActions.confirm({
        Component: AskInsufficientRestTime,
        params: {
          employeeId,
          targetDate,
          insufficientRestTime,
        },
      })
    );

    if (!result) {
      return false;
    }

    try {
      dispatch(commonActions.loadingStart());

      await DailyRestTimeFill.post({
        targetDate: targetDate || null,
        employeeId: employeeId || null,
      });

      return true;
    } catch (err) {
      dispatch(commonActions.catchApiError(err, { isContinuable: true }));
      return false;
    } finally {
      dispatch(commonActions.loadingEnd());
    }
  };
