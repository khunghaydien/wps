import '../../commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../../commons/styles/base.scss';
import '../../commons/config/moment';
import '../../commons/config/sentry';
import { CoreProvider } from '../../core';

import { Permission } from '../../domain/models/access-control/Permission';

import * as AppActions from './action-dispatchers/App';
import { AppDispatch } from './action-dispatchers/AppThunk';

import AppContainer from './containers/AppContainer';

import setup from './config/production';
import configureStore from './store/configureStore';

function renderApp(store, Component) {
  ReactDOM.render(
    <Provider store={store}>
      <CoreProvider>
        <Component />
      </CoreProvider>
    </Provider>,
    document.getElementById('container')
  );
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = (params: { userPermission: Permission }) => {
  const configuredStore = configureStore();
  const dispatch = configuredStore.dispatch as AppDispatch;
  setup({ store: configuredStore, permission: params.userPermission });
  renderApp(configuredStore, AppContainer);
  dispatch(AppActions.initialize(params));
};
