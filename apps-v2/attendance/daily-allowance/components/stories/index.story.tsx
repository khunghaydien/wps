import React from 'react';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../../core';

import { withProvider } from '../../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import DailyAllowance from '../index';
import {
  dailyAllowanceAllList,
  dailyAllowanceIsSelectedList,
} from './mocks/dailyAllowances';
import storeMock from './mocks/store.mock';

const store = configureStore(storeMock);

export default {
  title: 'attendance/daily-allowance/overall',
  decorators: [
    withProvider(store),
    (story: Function) => <CoreProvider>{story()}</CoreProvider>,
  ],
};

export const HasModal = () => (
  <DailyAllowance
    isModal={true}
    isLoading={false}
    isLocked={false}
    targetDate={'2021-12-03'}
    isSelectedTab={false}
    dailyAllowanceAllList={dailyAllowanceAllList}
    toggleSelection={action('toggleSelection')}
    onClose={action('onClose')}
    onSave={action('onSave')}
  />
);

HasModal.storyName = 'hasModal';

export const WhileLoading = () => (
  <DailyAllowance
    isModal={true}
    isLoading
    isLocked={false}
    targetDate={'2021-12-03'}
    isSelectedTab={false}
    dailyAllowanceAllList={dailyAllowanceAllList}
    toggleSelection={action('toggleSelection')}
    onClose={action('onClose')}
    onSave={action('onSave')}
  />
);

WhileLoading.storyName = 'while loading';

export const isSelectedTab = () => (
  <DailyAllowance
    isModal={true}
    isLoading={false}
    isLocked={false}
    targetDate={'2021-12-03'}
    isSelectedTab={true}
    dailyAllowanceAllList={dailyAllowanceIsSelectedList}
    toggleSelection={action('toggleSelection')}
    onClose={action('onClose')}
    onSave={action('onSave')}
  />
);

isSelectedTab.storyName = 'is selected tab';

export const IsLocked = () => (
  <DailyAllowance
    isModal={true}
    isLoading={false}
    isLocked={true}
    targetDate={'2021-12-03'}
    isSelectedTab={true}
    dailyAllowanceAllList={dailyAllowanceIsSelectedList}
    toggleSelection={action('toggleSelection')}
    onClose={action('onClose')}
    onSave={action('onSave')}
  />
);

IsLocked.storyName = 'save button is locked';
