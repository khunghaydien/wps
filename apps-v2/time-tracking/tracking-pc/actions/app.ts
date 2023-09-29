import { getUserSetting } from '@commons/actions/userSetting';
import { actions as appActions } from '@commons/modules/app';
import DateUtil from '@commons/utils/DateUtil';

import { AppDispatch } from '../modules/AppThunk';

import TimeTracking from './TimeTracking';

/* eslint-disable import/prefer-default-export */
export const init =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    const timeTracking = TimeTracking(dispatch);

    dispatch(appActions.loadingStart());
    try {
      await dispatch(getUserSetting());
      const dateInCurrentPeriod = DateUtil.getToday();
      await timeTracking.loadPeriodAt(dateInCurrentPeriod);
    } catch (e) {
      dispatch(
        appActions.catchApiError(e, {
          isContinuable: false,
        })
      );
    } finally {
      dispatch(appActions.loadingEnd());
    }
  };
