import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';
import onDevelopment from '../commons/config/development';
import { CoreProvider } from '../core';

import * as AppActions from './action-dispatchers/App';

import AdminContainer from '@admin-pc/containers/AdminContainer';

import Api from './api/local';
import configureStore from '@admin-pc/store/configureStore';

const renderApp = (store, Component) => {
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
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = (params: AppActions.AppParam) => {
  const configuredStore = configureStore({
    env: {
      api: new Api(),
    },
  });
  renderApp(configuredStore, AdminContainer);
  // @ts-ignore
  configuredStore.dispatch(AppActions.initialize(params));
};
