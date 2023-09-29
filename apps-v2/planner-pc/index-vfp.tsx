import '../commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../commons/styles/base.scss';
import '../commons/config/moment';
import '../commons/config/sentry';
import { CoreProvider } from '../core';

import { Permission } from '@apps/domain/models/access-control/Permission';

import App from './action-dispatchers/App';

import PlannerContainer from './containers/PlannerContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component): void {
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
export const startApp = (params: {
  userPermission: Permission;
  targetDate?: string;
}): void => {
  const configuredStore = configureStore();
  renderApp(configuredStore, PlannerContainer);
  App(configuredStore.dispatch).initialize(params);
};
