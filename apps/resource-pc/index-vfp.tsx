import '@apps/commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '@apps/commons/config/moment';
import '@apps/commons/styles/base.scss';
import '@apps/commons/config/sentry';
import { CoreProvider } from '@apps/core';

import AppContainer from './containers/AppContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component) {
  const appMountintgPoint = document.getElementById('container');
  if (appMountintgPoint === null) {
    throw new Error('Application Mouting Point Error: Not found `container`');
  }

  ReactDOM.render(
    <Provider store={store}>
      <CoreProvider>
        <Component />
      </CoreProvider>
    </Provider>,
    appMountintgPoint
  );
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
};
