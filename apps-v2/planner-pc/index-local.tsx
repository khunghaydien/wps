import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';
import onDevelopment from '../commons/config/development';
import { CoreProvider } from '../core';

import { Permission } from '@apps/admin-pc/models/permission/Permission';

import App from './action-dispatchers/App';

import PlannerContainer from './containers/PlannerContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component): void {
  const container = document.getElementById('container');
  if (container) {
    onDevelopment(() => {
      ReactDOM.render(
        <Provider store={store}>
          <CoreProvider>
            <Component />
          </CoreProvider>
        </Provider>,
        container
      );
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = (params: {
  userPermission: Permission;
  targetDate?: string;
}): void => {
  const configuredStore = configureStore();
  renderApp(configuredStore, PlannerContainer);
  App(configuredStore.dispatch).initialize(params);
};
