import React from 'react';

import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import { defaultValue as records } from '../../__stories__/mocks/records.mock';
import Component from '../FilterBar';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/List/FilterBar',
  decorators: [withKnobs],
};

export const Default = (): React.ReactNode => (
  <Component
    records={records}
    searchQuery={{
      employee: [],
      department: [],
      targetDate: '',
      requestAndEvent: [],
    }}
    changeQuery={action('changeQuery')}
  />
);
