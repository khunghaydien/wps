import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { Permission } from '@apps/domain/models/access-control/Permission';

import AppContainer from './containers/AppContainer';

import setup from './config/production';
import configureStore from './store/configureStore';

// eslint-disable-next-line import/prefer-default-export
export const startApp = ({
  userPermission,
}: {
  userPermission: Permission;
}) => {
  const store = configureStore();

  setup({ store, permission: userPermission });

  const root = createRoot(document.getElementById('container'));
  root.render(
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};
