import * as React from 'react';

import { action } from '@storybook/addon-actions';

import { PeriodNavigation } from '../index';

export default {
  title: 'core/PeriodNavigation',
};

export const Default = () => (
  <PeriodNavigation
    startDate="2019-11-11"
    endDate="2019-11-18"
    onClickCurrent={action('onClickCurrent')}
    onClickNext={action('onClickNext')}
    onClickPrev={action('onClickPrev')}
  />
);

Default.storyName = 'default';
