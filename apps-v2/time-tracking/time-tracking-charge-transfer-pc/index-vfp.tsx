import '../../commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../../commons/styles/base.scss';
import '../../commons/config/moment';
import '../../commons/config/sentry';

import { Permission } from '@apps/domain/models/access-control/Permission';

import App from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/App';

import AppComponent from '@apps/time-tracking/time-tracking-charge-transfer-pc/components/App';

import configureStore from './store/configureStore';

function renderApp(store, Component): void {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('container')
  );
}

export const startApp = (param: { userPermission: Permission }): void => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppComponent);
  App(configuredStore.dispatch).initialize(param);
};
