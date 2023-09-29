import '../commons/config/public-path';

/* eslint-disable import/imports-first */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/* eslint-enable */
import '../commons/styles/base.scss';
import '../commons/config/moment';
import '../commons/config/sentry';
import msg from '../commons/languages';

// share the same entry point from Expenses
import AppContainer from './containers/AppContainer';

import configureStore from './store/configureStore';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';

const ErrorBoundary = SentryErrorBoundary as unknown as React.ComponentType<
  React.ComponentProps<typeof SentryErrorBoundary> & {
    children: React.ReactNode;
  }
>;

const renderApp = (store, Component: React.ComponentType<any>) => {
  const container = document.getElementById('container');
  if (container) {
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
  }
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  renderApp(configuredStore, AppContainer);
};
