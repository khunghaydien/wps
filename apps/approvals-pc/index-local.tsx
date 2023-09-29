import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';
import onDevelopment from '../commons/config/development';
import UrlUtil from '../commons/utils/UrlUtil';

import { tabType as TABS } from './modules/ui/tabs';

import * as appActions from './action-dispatchers/App';
import { AppDispatch } from './action-dispatchers/AppThunk';

import AppContainer from './containers/AppContainer';
import RequestDetailContainer from './containers/ExpensesPreApprovalListPane/DetailContainer';
import ExpenseDetailContainer from './containers/ExpensesRequestListPane/DetailContainer';

import configureStore from './store/configureStore';

function renderApp(store, Component) {
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
}

// Display detail when link open from email
const getDisplayContainer = (selectedTab?: string) => {
  switch (selectedTab) {
    case TABS.EXP_PRE_APPROVAL:
      return RequestDetailContainer;
    case TABS.EXPENSES:
      return ExpenseDetailContainer;
    default:
      return AppContainer;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = (param) => {
  const configuredStore = configureStore();
  const urlParams = UrlUtil.getUrlQuery();
  const selectedTab = urlParams && urlParams.tab;
  const isApexViewWithTabParam = !!selectedTab;
  renderApp(configuredStore, getDisplayContainer(selectedTab));
  (configuredStore.dispatch as AppDispatch)(
    appActions.initialize(param, isApexViewWithTabParam)
  );
};
