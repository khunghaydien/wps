import '../../commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../../commons/styles/base.scss';
import '../../commons/config/moment';
import '../../commons/config/sentry';

import App from './action-dispatchers/App';

import TimestampWidgetContainer from './containers/TimestampWidgetContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component) {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('container')
  );
}

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  renderApp(configuredStore, TimestampWidgetContainer);
  App(configuredStore.dispatch).initialize();
};
