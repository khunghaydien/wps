import React from 'react';
import { Provider } from 'react-redux';

import { action } from '@storybook/addon-actions';

import configureStore from '../../store/configureStore';
import TransferDialog from '../TransferDialog';

const mockNoDestTask = configureStore({
  ui: {
    timeTrackingCharge: {
      summaryId: '1',
      summaryPeriod: {
        startDate: new Date('2020-12-01'),
        endDate: new Date('2020-12-31'),
      },
      startDate: new Date('2020-12-01'),
      endDate: new Date('2020-12-31'),
      srcTask: {
        jobCode: 'EPIC-WPB-1000',
        jobName: 'Develop Time Tracking Charge Transfer',
        jobId: '1',
        workCategoryCode: 'DEV-003',
        workCategoryName: 'Testing',
        workCategoryId: '1',
      },
      destTask: {},
    },
  },
  common: {
    toast: {},
  },
} as any);

const mockHasDestTask = configureStore({
  ui: {
    timeTrackingCharge: {
      summaryId: '1',
      summaryPeriod: {
        startDate: new Date('2020-12-01'),
        endDate: new Date('2020-12-31'),
      },
      startDate: new Date('2020-12-01'),
      endDate: new Date('2020-12-31'),
      srcTask: {
        jobCode: 'EPIC-WPB-1000',
        jobName: 'Develop Time Tracking Charge Transfer',
        jobId: '1',
        workCategoryCode: 'DEV-003',
        workCategoryName: 'Testing',
        workCategoryId: '1',
      },
      destTask: {
        jobCode: 'EPIC-WPB-1000',
        jobName: 'Develop Time Tracking Charge Transfer',
        jobId: 'ID-1',
        workCategoryCode: 'DEV-003',
        workCategoryName: 'Testing',
        workCategoryId: '1',
      },
    },
  },
  common: {
    toast: {},
  },
} as any);

const mockLongTask = configureStore({
  ui: {
    timeTrackingCharge: {
      summaryId: '1',
      summaryPeriod: {
        startDate: new Date('2020-12-01'),
        endDate: new Date('2020-12-31'),
      },
      startDate: new Date('2020-12-01'),
      endDate: new Date('2020-12-31'),
      srcTask: {
        jobCode:
          'EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000 ',
        jobName:
          'Develop Time Tracking Charge Transfer Long Develop Time Tracking Charge Transfer Long Develop Time Tracking Charge Transfer Long',
        jobId: '1',
        workCategoryCode:
          'DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003',
        workCategoryName:
          'Testing TestingTestingTestingTestingTestingTestingTestingTestingTestingTestingTestingTestingTestingTesting',
        workCategoryId: '1',
      },
      destTask: {
        jobCode:
          'EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000 EPIC-WPB-1000',
        jobName:
          'Develop Time Tracking Charge Transfer Long Develop Time Tracking Charge Transfer Long Develop Time Tracking Charge Transfer Long',
        jobId: 'ID-1',
        workCategoryCode:
          'DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003 DEV-003',
        workCategoryName:
          'Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing',
        workCategoryId: '1',
      },
    },
  },
  common: {
    toast: {},
  },
} as any);

export default {
  title: 'time-tracking/time-tracking-charge-transfer-pc/Transfer Dialog',
};

export const NoDestTask = () => (
  <Provider store={mockNoDestTask}>
    <TransferDialog onClose={action('onClose')} onSave={action('onSave')} />
  </Provider>
);

NoDestTask.storyName = 'No destination task';

export const HasDestTask = () => (
  <Provider store={mockHasDestTask}>
    <TransferDialog onClose={action('onClose')} onSave={action('onSave')} />
  </Provider>
);

HasDestTask.storyName = 'Has destination task';

export const LongTask = () => (
  <Provider store={mockLongTask}>
    <TransferDialog onClose={action('onClose')} onSave={action('onSave')} />
  </Provider>
);
