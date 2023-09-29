import { bindActionCreators, Dispatch } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import { getUserSetting } from '../../../commons/actions/userSetting';

import DailyStampTimeRepository from '@attendance/repositories/DailyStampTimeRepository';

import { actions as stampUiActions } from '../modules/entities/dailyStampTime';

import { AppDispatch } from '../../timesheet-pc/action-dispatchers/AppThunk';

const App = (dispatch: Dispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

export default (dispatch: AppDispatch) => {
  const app = App(dispatch);

  const reload = async () => {
    app.loadingStart();
    try {
      const result = await DailyStampTimeRepository.fetch();
      dispatch(stampUiActions.set(result));
    } catch (error) {
      app.catchApiError(error, { isContinuable: false });
    } finally {
      app.loadingEnd();
    }
  };

  return {
    initialize: async () => {
      app.loadingStart();
      try {
        dispatch(getUserSetting());
        await reload();
      } catch (error) {
        app.catchApiError(error, { isContinuable: false });
      } finally {
        app.loadingEnd();
      }
    },
    reload,
  };
};
