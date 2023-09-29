import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../commons/styles/base.scss';
import '../commons/config/moment';
import onDevelopment from '../commons/config/development';

import { tabType as TABS } from './modules/ui/tabs';

import * as appActions from './action-dispatchers/App';
import { AppDispatch } from './action-dispatchers/AppThunk';

import { getApexViewParams } from './utils/ApexViewUtils';

import AppContainer from './containers/AppContainer';
import DetailContainer from './containers/CustomRequest/DetailContainer';
import RequestDetailContainer from './containers/ExpensesPreApprovalListPane/DetailContainer';
import ExpenseDetailContainer from './containers/ExpensesRequestListPane/DetailContainer';

import WithToastContainer from './components/WithToastContainer';

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
      return WithToastContainer(RequestDetailContainer);
    case TABS.EXPENSES:
      return WithToastContainer(ExpenseDetailContainer);
    case TABS.CUSTOM_REQUEST:
      return WithToastContainer(DetailContainer);
    default:
      return AppContainer;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const startApp = (param) => {
  const configuredStore = configureStore();
  const { tab: selectedTab } = getApexViewParams();
  const isApexViewWithTabParam = !!selectedTab;
  renderApp(configuredStore, getDisplayContainer(selectedTab));
  (configuredStore.dispatch as AppDispatch)(
    appActions.initialize(param, isApexViewWithTabParam)
  );
};
