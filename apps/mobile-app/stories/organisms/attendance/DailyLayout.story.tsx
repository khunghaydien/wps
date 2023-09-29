import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Component, {
  TABS,
} from '../../../components/organisms/attendance/DailyLayout';

export default {
  title: 'Components/organisms/attendance',
  decorators: [withKnobs, withInfo],
};

export const DailyLayout = () => (
  <Component
    tab={TABS.request}
    title={text('title', 'TITLE')}
    currentDate={text('currentDate', '2019-01-10')}
    startDate={text('currentDate', '2019-01-01')}
    onChangeDate={action('onChangeDate')}
    onClickBackMonth={action('onClickBackMonth')}
    onClickPrevDate={action('onClickPrevDate')}
    onClickNextDate={action('onClickNextDate')}
    onClickTimesheetDaily={action('onClickTimesheetDaily')}
    onClickDailyRequest={action('onClickDailyRequest')}
    onClickRefresh={action('onClickRefresh')}
  >
    <div>STORYBOOK</div>
  </Component>
);

DailyLayout.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      Common layout for working input and daily request page.
    `,
  },
};
