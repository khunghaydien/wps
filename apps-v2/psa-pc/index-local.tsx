import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '@apps/commons/config/moment';
import '@apps/commons/styles/base.scss';
import onDevelopment from '@apps/commons/config/development';
import { CoreProvider } from '@apps/core';

import { getApexViewParams } from '@psa/utils/ApexViewUtils';

import AppContainer from '@psa/containers/AppContainer';

import configureStore from '@psa/store/configureStore';

function renderApp(store, Component) {
  const appMountintgPoint = document.getElementById('container');
  if (appMountintgPoint === null) {
    throw new Error('Application Mouting Point Error: Not found `container`');
  }

  onDevelopment(() => {
    ReactDOM.render(
      <Provider store={store}>
        <CoreProvider>
          <Component
            permission='write'
            projectId={getApexViewParams().projectId}
          />
        </CoreProvider>
      </Provider>,
      appMountintgPoint
    );
  });
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
};
