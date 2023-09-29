import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { State } from '@attendance/timesheet-pc/modules';

import { AppDispatch } from '@attendance/timesheet-pc/action-dispatchers/AppThunk';
import { initDailyStampTime } from '@attendance/timesheet-pc/action-dispatchers/StampWidget';

export default (store: Store) => async (): Promise<void> => {
  const state = store.getState() as State;
  const dispatch = store.dispatch as AppDispatch;

  const delegatedEmployeeInfo = state.common.proxyEmployeeInfo;
  const isDelegated = delegatedEmployeeInfo.isProxyMode;

  if (!isDelegated) {
    dispatch(loadingStart());
    try {
      // FIXME: ts-ignore
      // @ts-ignore
      await dispatch(initDailyStampTime());
    } catch (error) {
      if (!(store.getState() as State).common.app.error) {
        dispatch(catchApiError(error));
      }
    } finally {
      dispatch(loadingEnd());
    }
  }
};
