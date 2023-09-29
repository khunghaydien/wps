import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import {
  defaultValue as request,
  dividedInnerSummaries,
} from '@attendance/domain/models/approval/__tests__/mocks/FixDailyRequest.mock';

import Component from '../Summaries';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/Detail/Content/Summaries',
  decorators: [withKnobs],
};

export const Default = (): React.ReactElement => (
  <Component summaries={request.summaries} dividedSummaries={[]} />
);

export const Minimum = (): React.ReactElement => (
  <Component
    summaries={request.summaries}
    dividedSummaries={[
      {
        name: 'A',
        startDate: '2022-02-01',
        endDate: '2022-02-01',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'B',
        startDate: '2022-02-02',
        endDate: '2022-02-02',
        summaries: dividedInnerSummaries,
      },
    ]}
    expanded={false}
  />
);

export const ShowAll = (): React.ReactElement => (
  <Component
    summaries={request.summaries}
    dividedSummaries={[
      {
        name: 'LONG TEXT LONG TEXT LONG TEXT LONG TEXT LONG TEXT LONG TEXT LONG TEXT',
        startDate: '2022-02-01',
        endDate: '2022-02-01',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'B',
        startDate: '2022-02-02',
        endDate: '2022-02-02',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'C',
        startDate: '2022-02-03',
        endDate: '2022-02-03',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'D',
        startDate: '2022-02-04',
        endDate: '2022-02-04',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'E',
        startDate: '2022-02-05',
        endDate: '2022-02-05',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'F',
        startDate: '2022-02-06',
        endDate: '2022-02-06',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'G',
        startDate: '2022-02-07',
        endDate: '2022-02-07',
        summaries: dividedInnerSummaries,
      },
    ]}
    expanded={true}
  />
);

export const Contract = (): React.ReactElement => (
  <Component
    summaries={request.summaries}
    dividedSummaries={[
      {
        name: 'LONG TEXT LONG TEXT LONG TEXT LONG TEXT LONG TEXT LONG TEXT LONG TEXT',
        startDate: '2022-02-01',
        endDate: '2022-02-01',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'B',
        startDate: '2022-02-02',
        endDate: '2022-02-02',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'C',
        startDate: '2022-02-03',
        endDate: '2022-02-03',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'D',
        startDate: '2022-02-04',
        endDate: '2022-02-04',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'E',
        startDate: '2022-02-05',
        endDate: '2022-02-05',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'F',
        startDate: '2022-02-06',
        endDate: '2022-02-06',
        summaries: dividedInnerSummaries,
      },
      {
        name: 'G',
        startDate: '2022-02-07',
        endDate: '2022-02-07',
        summaries: dividedInnerSummaries,
      },
    ]}
    expanded={false}
  />
);
