import React from 'react';

import { action } from '@storybook/addon-actions';

import WorkReportCard from '../WorkReportCard';

export default {
  title: 'daily-summary/WorkReportCard',
};

export const Closed = () => (
  <WorkReportCard value="TEST" onChange={action('onChange')} />
);

Closed.storyName = 'closed';

export const Opened = () => (
  <WorkReportCard defaultOpen value="TEST" onChange={action('onChange')} />
);

Opened.storyName = 'opened';

export const ReadOnly = () => (
  <WorkReportCard
    defaultOpen
    readOnly
    value="TEST"
    onChange={action('onChange')}
  />
);

ReadOnly.storyName = 'readOnly';
