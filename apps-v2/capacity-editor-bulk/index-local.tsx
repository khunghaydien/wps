import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';
import onDevelopment from '../commons/config/development';
import { CoreProvider } from '../core';

import AppContainer from './containers/AppContainer';

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
export const startApp = () => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
};
