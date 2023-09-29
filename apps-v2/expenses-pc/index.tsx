import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';

// share the same entry point from Expenses
import AppContainer from './containers/AppContainer';

import configureStore from './store/configureStore';

const renderApp = (store, Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('container')
  );
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
};
