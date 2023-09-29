import React from 'react';
import { Provider } from 'react-redux';

import AppHeader from '@apps/time-tracking/time-tracking-charge-transfer-pc/components/AppHeader';

import configureStore from '../../store/configureStore';

const store = configureStore({
  widgets: {
    PersonalMenuPopover: {
      ui: {
        visible: false,
      },
    },
  },
} as any);

export default {
  title: 'time-tracking|time-tracking-charge-transfer-pc',
};

export const _AppHeader: React.FC = () => (
  <Provider store={store}>
    <AppHeader />
  </Provider>
);
