import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../../commons/styles/base.scss';
import '../../commons/config/moment';
import onDevelopment from '../../commons/config/development';

import { Permission } from '@apps/domain/models/access-control/Permission';

import App from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/App';

import AppComponent from '@apps/time-tracking/time-tracking-charge-transfer-pc/components/App';

import configureStore from './store/configureStore';

function renderApp(store, Component): void {
  const container = document.getElementById('container');
  if (container) {
    onDevelopment(() => {
      ReactDOM.render(
        <Provider store={store}>
          <Component />
        </Provider>,
        container
      );
    });
  }
}

export const startApp = (param: { userPermission: Permission }): void => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppComponent);
  App(configuredStore.dispatch).initialize(param);
};
