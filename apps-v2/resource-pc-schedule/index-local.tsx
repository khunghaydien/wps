import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/config/moment';
import '../commons/styles/base.scss';
import onDevelopment from '../commons/config/development';

import App from './action-dispatchers/App';

import AppContainer from './containers/AppContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component) {
  const appMountintgPoint = document.getElementById('container');

  if (appMountintgPoint === null) {
    throw new Error('Application Mouting Point Error: Not found `container`');
  }

  onDevelopment(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Component />
      </Provider>,
      appMountintgPoint
    );
  });
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
  App(configuredStore.dispatch).initialize();
};
