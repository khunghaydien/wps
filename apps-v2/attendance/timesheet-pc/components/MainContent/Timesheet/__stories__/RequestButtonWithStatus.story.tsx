import React from 'react';

import { action } from '@storybook/addon-actions';

import {
  dailyRequestConditionsHasApprovalIn,
  dailyRequestConditionsHasApproved,
  dailyRequestConditionsHasNoRequests,
  dailyRequestConditionsHasRejected,
} from '../../../__stories__/mock-data/dailyRequestConditions';
import RequestButtonWithStatus from '../RequestButtonWithStatus';

export default {
  title:
    'attendance/timesheet-pc/MainContent/Timesheet/RequestButtonWithStatus',
};

export const Default = () => (
  <RequestButtonWithStatus
    requestConditions={dailyRequestConditionsHasNoRequests}
    onClick={action('Clicked')}
  />
);

Default.storyName = 'default';

Default.parameters = {
  info: {
    propTables: [RequestButtonWithStatus],
    inline: true,
    source: true,
  },
};

export const ステータス表示の優先度1却下 = () => (
  <RequestButtonWithStatus
    requestConditions={dailyRequestConditionsHasRejected}
    onClick={action('Clicked')}
  />
);

ステータス表示の優先度1却下.storyName = 'ステータス表示の優先度 1: 却下';

ステータス表示の優先度1却下.parameters = {
  info: {
    propTables: [RequestButtonWithStatus],
    inline: true,
    source: true,
  },
};

export const ステータス表示の優先度2承認待ち = () => (
  <RequestButtonWithStatus
    requestConditions={dailyRequestConditionsHasApprovalIn}
    onClick={action('Clicked')}
  />
);

ステータス表示の優先度2承認待ち.storyName =
  'ステータス表示の優先度 2: 承認待ち';

ステータス表示の優先度2承認待ち.parameters = {
  info: {
    propTables: [RequestButtonWithStatus],
    inline: true,
    source: true,
  },
};

export const ステータス表示の優先度3承認済み = () => (
  <RequestButtonWithStatus
    requestConditions={dailyRequestConditionsHasApproved}
    onClick={action('Clicked')}
  />
);

ステータス表示の優先度3承認済み.storyName =
  'ステータス表示の優先度 3: 承認済み';

ステータス表示の優先度3承認済み.parameters = {
  info: {
    propTables: [RequestButtonWithStatus],
    inline: true,
    source: true,
  },
};
