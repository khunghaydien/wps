import React from 'react';

import { action } from '@storybook/addon-actions';

import WorkCategoryDropdown from '../WorkCategoryDropdown';

export default {
  title: 'time-tracking/WorkCategoryDropdown',
  component: WorkCategoryDropdown,
};

export const NoSelectedItem = () => (
  <WorkCategoryDropdown
    isLoading={false}
    items={[
      {
        id: '#1',
        code: 'WC1',
        name: 'WorkCategory A',
      },
      {
        id: '#2',
        code: 'WC2',
        name: 'WorkCategory B',
      },
      {
        id: '#3',
        code: 'WC3',
        name: 'WorkCategory C',
      },
    ]}
    onClick={action('onClick')}
    onSelect={action('onSelect')}
  />
);

NoSelectedItem.storyName = 'no selected item';

export const SelectedItem = () => (
  <WorkCategoryDropdown
    isLoading={false}
    value={{
      id: '#2',
      code: 'WC2',
      name: 'WorkCategory B',
    }}
    items={[
      {
        id: '#1',
        code: 'WC1',
        name: 'WorkCategory A',
      },
      {
        id: '#2',
        code: 'WC2',
        name: 'WorkCategory B',
      },
      {
        id: '#3',
        code: 'WC3',
        name: 'WorkCategory C',
      },
    ]}
    onClick={action('onClick')}
    onSelect={action('onSelect')}
  />
);

SelectedItem.storyName = 'selected item';

export const ReadOnly = () => (
  <WorkCategoryDropdown
    isLoading={false}
    readOnly
    value={{
      id: '#2',
      code: 'WC2',
      name: 'WorkCategory B',
    }}
    items={[
      {
        id: '#1',
        code: 'WC1',
        name: 'WorkCategory A',
      },
      {
        id: '#2',
        code: 'WC2',
        name: 'WorkCategory B',
      },
      {
        id: '#3',
        code: 'WC3',
        name: 'WorkCategory C',
      },
    ]}
    onClick={action('onClick')}
    onSelect={action('onSelect')}
  />
);

ReadOnly.storyName = 'readOnly';

export const WhileLoadingWorkCategories = () => (
  <WorkCategoryDropdown
    isLoading
    readOnly
    value={{
      id: '#2',
      code: 'WC2',
      name: 'WorkCategory B',
    }}
    items={[
      {
        id: '#1',
        code: 'WC1',
        name: 'WorkCategory A',
      },
      {
        id: '#2',
        code: 'WC2',
        name: 'WorkCategory B',
      },
      {
        id: '#3',
        code: 'WC3',
        name: 'WorkCategory C',
      },
    ]}
    onClick={action('onClick')}
    onSelect={action('onSelect')}
  />
);

WhileLoadingWorkCategories.storyName = 'while loading work categories';
