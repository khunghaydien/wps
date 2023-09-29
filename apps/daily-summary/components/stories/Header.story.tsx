import React from 'react';

import { action } from '@storybook/addon-actions';

import Header from '../Header';

export default {
  title: 'daily-summary',
};

export const _Header = () => (
  <Header
    targetDate="2020-10-08"
    onClickPrev={action('onClickPrev')}
    onSelectDate={action('onSelectDate')}
    onClickNext={action('onClickNext')}
  />
);
