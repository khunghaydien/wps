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

import configureStore from './store/configureStore';
import { ErrorBoundary } from '@sentry/react';

const AppContainer = React.lazy(() => import('./containers/AppContainer'));

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
          <React.Suspense fallback={<div>{msg().Com_Lbl_Loading}</div>}>
            <Component />
          </React.Suspense>
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
