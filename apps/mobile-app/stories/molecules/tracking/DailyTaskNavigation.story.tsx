import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import DailyTaskNavigation from '../../../components/molecules/tracking/DailyTaskNavigation';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/tracking',
  decorators: [withKnobs, withInfo],
};

export const _DailyTaskNavigation: FCStory = () => (
  <DailyTaskNavigation
    today={text('today', '2018-10-02')}
    listEditing={false}
    onClickMonthlySummary={action('onClickMonthlySummary')}
    onChangeDate={action('onChangeDate')}
    onClickPrevDate={action('onChangePrevDate')}
    onClickNextDate={action('onChangeNextDate')}
    onToggleEditing={action('onToggleEditing')}
    onClickRefresh={action('onClickRefresh')}
  />
);

_DailyTaskNavigation.storyName = 'DailyTaskNavigation';
_DailyTaskNavigation.parameters = {
  info: {
    inline: false,
    text: `
    AAAA
`,
  },
};
