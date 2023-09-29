import React from 'react';

import { action } from '@storybook/addon-actions';

import SummaryPeriodNav from '../SummaryPeriodNav';
import periodList from './mock-data/summaryPeriodList';

export default {
  title: 'timesheet-pc/MainContent/SummaryPeriodNav',
  parameters: {
    info: { propTables: [SummaryPeriodNav], inline: true, source: true },
  },
};

export const Default = () => (
  <SummaryPeriodNav
    summaryPeriodList={periodList}
    selectedPeriodStartDate="2017-08-01"
    onPeriodSelected={action('集計期間選択')}
  />
);

Default.storyName = 'default';

export const HireMonth = () => (
  <SummaryPeriodNav
    summaryPeriodList={periodList}
    selectedPeriodStartDate="2016-08-01"
    onPeriodSelected={action('集計期間選択')}
  />
);
HireMonth.storyName = '最も古い期間が選択されている場合（入社月）';

export const LeaveMonth = () => (
  <SummaryPeriodNav
    summaryPeriodList={periodList}
    selectedPeriodStartDate="2017-10-01"
    onPeriodSelected={action('集計期間選択')}
  />
);
LeaveMonth.storyName = '最も新しい期間が選択されている場合（退職月）';
