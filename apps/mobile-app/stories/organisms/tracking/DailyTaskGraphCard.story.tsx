import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { object, withKnobs } from '@storybook/addon-knobs';

import DailyTaskGraphCard from '../../../components/organisms/tracking/DailyTaskGraphCard';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/organisms/tracking',
  decorators: [withKnobs, withInfo],
};

export const _DailyTaskGraphCard: FCStory = () => (
  <DailyTaskGraphCard
    realWorkTime={540}
    taskTimes={object('taskTimes', [
      {
        color: '#0083b6',
        value: 200,
      },
      {
        color: '#00a3df',
        value: 200,
      },
      {
        color: '#00b3df',
        value: 130,
      },
    ])}
  />
);

_DailyTaskGraphCard.displayName = 'DailyTaskGraphCard';
_DailyTaskGraphCard.parameters = {
  info: {
    text: `
      A graph showing tracked time and real work time.
    `,
  },
};

export const DailyTaskGraphCardNoGap: FCStory = () => (
  <DailyTaskGraphCard
    realWorkTime={540}
    taskTimes={object('taskTimes', [
      {
        color: '#0083b6',
        value: 200,
      },
      {
        color: '#00a3df',
        value: 200,
      },
      {
        color: '#00b3df',
        value: 140,
      },
    ])}
  />
);

DailyTaskGraphCardNoGap.storyName = 'DailyTaskGraphCard - No gap';
DailyTaskGraphCardNoGap.parameters = {
  info: {
    text: `
      A graph showing tracked time and real work time.
    `,
  },
};

export const DailyTaskGraphCardOverwork: FCStory = () => (
  <DailyTaskGraphCard
    realWorkTime={1200}
    taskTimes={object('taskTimes', [
      {
        color: '#0083b6',
        value: 510,
      },
      {
        color: '#00a3df',
        value: 370,
      },
      {
        color: '#00b3df',
        value: 900,
      },
    ])}
  />
);

DailyTaskGraphCardOverwork.storyName = 'DailyTaskGraphCard - Overwork';

DailyTaskGraphCardOverwork.parameters = {
  info: {
    text: `
    A graph showing tracked time and real work time.
  `,
  },
};
