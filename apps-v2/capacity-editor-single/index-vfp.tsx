import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';
import '@apps/commons/config/sentry';
import { CoreProvider } from '../core';

import { getApexViewParams } from '@psa/utils/ApexViewUtils';

import AppContainer from './containers/AppContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component): void {
  const appMountintgPoint = document.getElementById('container');
  if (appMountintgPoint === null) {
    throw new Error('Application Mouting Point Error: Not found `container`');
  }

  ReactDOM.render(
    <Provider store={store}>
      <CoreProvider>
        <Component availabilityId={getApexViewParams().availabilityId} />
      </CoreProvider>
    </Provider>,
    appMountintgPoint
  );
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = (): void => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
};
