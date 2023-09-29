import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../../commons/styles/base.scss';
import '../../commons/config/moment';
import onDevelopment from '../../commons/config/development';

import { AppDispatch } from './modules/AppThunk';

import { init } from './actions/app';

import TrackingContainer from './containers/TrackingContainer';

import configureStore from './store/configureStore';

function createLocalReactBridge(store, Component) {
  return {
    render() {
      const container = document.getElementById('container');

      if (container) {
        onDevelopment(() => {
          ReactDOM.render(
            <Provider store={store}>
              <Component />
            </Provider>,
            container
          );
        });
      }
    },
  };
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  createLocalReactBridge(configuredStore, TrackingContainer).render();
  (configuredStore.dispatch as AppDispatch)(init());
};
