import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import onDevelopment from '../commons/config/development';
import { setUserPermission } from '../commons/modules/accessControl/permission';

import { Permission } from '../domain/models/access-control/Permission';

import App from './App';
import configureStore from './store/configureStore';

import './styles/base.scss';

const onTouchStart = () => {
  if (document.body) {
    document.body.setAttribute('ontouchstart', '');
  }
};

const renderApp =
  ({ store, ...props }: any) =>
  (Component: React.ComponentType<any>) => {
    const container = document.getElementById('container');
    if (container !== null) {
      onDevelopment(() => {
        ReactDOM.render(
          <Provider store={store}>
            <Component {...props} />
          </Provider>,
          container
        );
      });
    }
  };

// eslint-disable-next-line import/prefer-default-export
export const startApp = ({
  userPermission,
  pathname,
  search,
}: {
  userPermission: Permission;
  pathname?: string;
  search?: string;
}) => {
  const configuredStore = configureStore();
  onTouchStart();
  configuredStore.dispatch(setUserPermission(userPermission));
  renderApp({ pathname, search, store: configuredStore })(App);
};
