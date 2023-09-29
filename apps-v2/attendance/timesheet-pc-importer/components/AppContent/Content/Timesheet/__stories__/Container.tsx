import * as React from 'react';

import { action } from '@storybook/addon-actions';

import Component from '..';
import { defaultValues } from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel/__tests__/mocks/DailyRecordViewModel.mock';

const dailyRecords = new Map(
  defaultValues.map((record) => [record.recordDate, record])
);

export const Default = () => (
  <Component
    dailyRecords={dailyRecords}
    onClickCheckAll={action('Timesheet:onClickCheckAll')}
    onUpdateDailyRecords={action('Timesheet:onUpdateDailyRecord')}
  />
);
