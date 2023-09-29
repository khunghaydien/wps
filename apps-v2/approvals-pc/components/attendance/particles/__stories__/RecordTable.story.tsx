import React from 'react';

import { boolean, withKnobs } from '@storybook/addon-knobs';

import RecordTable from '../RecordTable';
import { defaultValue as summary } from './mocks/summary.mock';

export default {
  title: 'approvals-pc/attendance/particles/RecordTable',
  decorators: [withKnobs],
};

export const Default = (): React.ReactElement => (
  <RecordTable summary={summary} enabledTotal={boolean('enabledTotal', true)} />
);

export const Minimum = (): React.ReactElement => (
  <RecordTable
    summary={{
      ...summary,
      displayFieldLayout: null,
      workingType: {
        useAllowanceManagement: false,
        useManageCommuteCount: false,
        useObjectivelyEventLog: false,
        useRestReason: false,
      },
    }}
    enabledTotal={false}
  />
);

export const WithoutTotal = (): React.ReactElement => (
  <RecordTable summary={summary} enabledTotal={false} />
);

export const WithoutCommuteCount = (): React.ReactElement => (
  <RecordTable
    summary={{
      ...summary,
      setting: {
        ...summary.workingType,
        useManageCommuteCount: false,
      },
    }}
    enabledTotal={true}
  />
);

export const WithoutAllowance = (): React.ReactElement => (
  <RecordTable
    summary={{
      ...summary,
      setting: {
        ...summary.workingType,
        useAllowance: false,
      },
    }}
    enabledTotal={true}
  />
);

export const WithoutObjectivelyLog = (): React.ReactElement => (
  <RecordTable
    summary={{
      ...summary,
      setting: {
        ...summary.workingType,
        useObjectivelyEventLog: false,
      },
    }}
    enabledTotal={true}
  />
);

export const WithoutDailyFieldLayout = (): React.ReactElement => (
  <RecordTable
    summary={{
      ...summary,
      displayFieldLayout: null,
    }}
    enabledTotal={true}
  />
);
