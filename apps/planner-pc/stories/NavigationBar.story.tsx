import React, { ReactElement } from 'react';

import '../components/Planner.scss';
import NavigationBar from '../components/NavigationBar';

import { withProvider } from '../../../.storybook/decorator/Provider';
import configureStore from '../store/configureStore';

const store = configureStore();

export default {
  title: 'planner-pc',
  decorators: [withProvider(store)],
};

export const _NavigationBar = (): ReactElement => <NavigationBar />;

_NavigationBar.storyName = 'NavigationBar';
