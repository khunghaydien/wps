import { bindActionCreators, Dispatch } from 'redux';

import { actions as appActions } from '../../../commons/modules/app';

import RequestRepository from '../../../repositories/time-tracking/RequestRepository';

import { actions as summaryActions } from '../modules/entities/requestSummary';

import AppActions from './App';

const App = (dispatch: Dispatch) => ({
  ...bindActionCreators(appActions, dispatch),
  ...AppActions(dispatch),
});

export default (dispatch: Dispatch) => {
  const app = App(dispatch);
  return {
    initialize: async (requestId: string): Promise<void> => {
      dispatch(summaryActions.reset());
      try {
        app.loadingStart();

        const summary = await RequestRepository.fetchSummary({
          requestId,
        });
        dispatch(summaryActions.fetchSuccess(summary));
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },
  };
};
