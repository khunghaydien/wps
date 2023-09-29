import { bindActionCreators, Dispatch } from 'redux';

import { actions as appActions } from '@apps/commons/modules/app';

import RequestRepository from '@apps/repositories/time-tracking/RequestRepository';

import { actions } from '@apps/planner-pc/modules/entities/requestAlert';

import { AppDispatch } from './AppThunk';

const App = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      ...appActions,
    },
    dispatch
  );

export default (dispatch: AppDispatch) => {
  const app = App(dispatch);

  return {
    fetchAlert: async (
      param: Parameters<typeof RequestRepository['fetchAlert']>['0']
    ): Promise<void> => {
      app.loadingStart();
      try {
        const request = await RequestRepository.fetchAlert(param);
        dispatch(actions.fetchSuccess(request));
      } catch (error) {
        app.catchApiError(error, { isContinuable: true });
      } finally {
        app.loadingEnd();
      }
    },
  } as const;
};
