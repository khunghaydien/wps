import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';
import onDevelopment from '../commons/config/development';
import msg from '../commons/languages';

import AppContainer from './containers/AppContainer';

import configureStore from './store/configureStore';
import { ErrorBoundary } from '@sentry/react';

function renderApp(store, Component: React.ComponentType<any>): void {
  const container = document.getElementById('container');
  if (container) {
    onDevelopment(() => {
      ReactDOM.render(
        // Error Boundry for unhandled exceptions
        // This is needed for sentry to correctly identify source files in case of incident
        // TODO: Add fallback page for whiteout screen
        <ErrorBoundary
          fallback={<div>{msg().Com_Lbl_UnexpectedErrorPageTitle}</div>}
        >
          <Provider store={store}>
            <Component />
          </Provider>
        </ErrorBoundary>,
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
