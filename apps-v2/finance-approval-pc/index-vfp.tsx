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

import { AppDispatch } from './modules/AppThunk';
import { actions as isApexViewAction } from './modules/ui/FinanceApproval/isApexView';
import { selectTab, TABS } from './modules/ui/FinanceApproval/tabs';

import { initialize } from './action-dispatchers/app';

import { getApexViewParams } from './utils/ApexViewUtils';

import configureStore from './store/configureStore';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';

const ErrorBoundary = SentryErrorBoundary as unknown as React.ComponentType<
  React.ComponentProps<typeof SentryErrorBoundary> & {
    children: React.ReactNode;
  }
>;

const AppContainer = React.lazy(() => import('./containers/AppContainer'));

const ReportDetailContainer = React.lazy(
  () => import('./containers/FinanceApproval/ReportDetailContainer')
);

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
          <React.Suspense>
            <Component />
          </React.Suspense>
        </Provider>
      </ErrorBoundary>,
      container
    );
  }
};

// Display detail when link open from email
const getDisplayContainer = (selectedTab?: string) => {
  switch (selectedTab) {
    case TABS.EXPENSES:
    case TABS.REQUESTS:
      return ReportDetailContainer;
    default:
      return AppContainer;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = () => {
  const configuredStore = configureStore();
  const { tab: selectedTab } = getApexViewParams();
  const isApexViewWithTabParam = !!selectedTab;
  renderApp(configuredStore, getDisplayContainer(selectedTab));
  if (isApexViewWithTabParam) {
    configuredStore.dispatch(isApexViewAction.set());
    configuredStore.dispatch(selectTab(selectedTab));
    (configuredStore.dispatch as AppDispatch)(
      initialize(isApexViewWithTabParam)
    );
  }
};
