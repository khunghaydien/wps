import React from 'react';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../../core';

import { withProvider } from '../../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import Contents from '../Contents';
import {
  dailyAllowanceAllList,
  dailyAllowanceIsSelectedList,
} from './mocks/dailyAllowances';
import storeMock from './mocks/store.mock';

const store = configureStore(storeMock);

export default {
  title: 'attendance/daily-allowance/Contents',
  decorators: [
    withProvider(store),
    (story: Function) => <CoreProvider>{story()}</CoreProvider>,
  ],
};
export const WhileLoading = () => (
  <Contents
    isLoading
    isSelectedTab={false}
    dailyAllowanceAllList={dailyAllowanceAllList}
    toggleSelection={action('toggleSelection')}
  />
);

WhileLoading.storyName = 'while loading';

WhileLoading.decorators = [
  withProvider(store),
  (story: Function) => <CoreProvider>{story()}</CoreProvider>,
];

export const LoadingFalse = () => (
  <Contents
    isLoading={false}
    isSelectedTab={false}
    dailyAllowanceAllList={dailyAllowanceAllList}
    toggleSelection={action('toggleSelection')}
  />
);

LoadingFalse.storyName = 'loading false';

export const IsSelectedTab = () => (
  <Contents
    isLoading={false}
    isSelectedTab
    dailyAllowanceAllList={dailyAllowanceIsSelectedList}
    toggleSelection={action('toggleSelection')}
  />
);

IsSelectedTab.storyName = 'is selected tab';
