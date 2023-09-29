import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../../commons/config/moment';
import '../../commons/styles/base.scss';
import onDevelopment from '../../commons/config/development';

import * as appActions from './action-dispatchers/App';
import { AppDispatch } from './action-dispatchers/AppThunk';

import TimesheetSummaryContainer from './containers/TimesheetSummaryContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component) {
  const appMountintgPoint = document.getElementById('container');
  if (appMountintgPoint === null) {
    throw new Error('Application Mouting Point Error: Not found `container`');
  }

  onDevelopment(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Component />
      </Provider>,
      appMountintgPoint
    );
  });
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  const dispatch = configuredStore.dispatch as AppDispatch;
  renderApp(configuredStore, TimesheetSummaryContainer);
  dispatch(appActions.initialize());
};
