import '../../commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../../commons/styles/base.scss';
import '../../commons/config/moment';
import '../../commons/config/sentry';

import { AppDispatch } from './modules/AppThunk';

import { init } from './actions/app';

import TrackingContainer from './containers/TrackingContainer';

import configureStore from './store/configureStore';

function createVfpReactBridge(store, Component) {
  return {
    init() {},
    render() {
      ReactDOM.render(
        <Provider store={store}>
          <Component />
        </Provider>,
        // eslint-disable-next-line no-undef
        document.getElementById('container')
      );
    },
  };
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  createVfpReactBridge(configuredStore, TrackingContainer).render();
  (configuredStore.dispatch as AppDispatch)(init());
};
