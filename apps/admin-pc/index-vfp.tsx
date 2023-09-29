import '../commons/config/public-path';

/* eslint-disable import/imports-first */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../commons/styles/base.scss';
import '../commons/config/moment';
import '../commons/config/sentry';
import { CoreProvider } from '../core';

import * as AppActions from './action-dispatchers/App';

import AdminContainer from '@admin-pc/containers/AdminContainer';

import Api from './api/vfp';
import configureStore from '@admin-pc/store/configureStore';

const renderApp = (store, Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <CoreProvider>
        <Component />
      </CoreProvider>
    </Provider>,
    document.getElementById('container')
  );
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = (params: AppActions.AppParam) => {
  const configuredStore = configureStore({
    env: {
      api: new Api({}),
    },
  });
  renderApp(configuredStore, AdminContainer);
  // @ts-ignore
  configuredStore.dispatch(AppActions.initialize(params));
};
