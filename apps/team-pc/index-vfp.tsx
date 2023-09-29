import '../commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../commons/styles/base.scss';
import '../commons/config/moment';
import '../commons/config/sentry';

import { Permission } from '../domain/models/access-control/Permission';

import * as AppActions from './action-dispatchers/App';
import { AppDispatch } from './action-dispatchers/AppThunk';

import AppContainer from './containers/AppContainer';

import configureStore from './store/configureStore';

const renderApp = (store, Component: React.ComponentType<any>) => {
  const container = document.getElementById('container');
  if (container !== null) {
    ReactDOM.render(
      <Provider store={store}>
        <Component />
      </Provider>,
      container
    );
  }
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = (param?: { userPermission: Permission }) => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
  const dispatch = configuredStore.dispatch as AppDispatch;
  dispatch(AppActions.initialize(param));
};
