import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import JorudanListItem from '../../../components/molecules/expense/JorudanListItem';

export default {
  title: 'Components/molecules/expense/JorudanListItem',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <JorudanListItem
    onClick={action('onClick only item')}
    amount={text('amount', '￥11,604')}
    returnAmount={text('returnAmount', '(往復:￥23,208)')}
    routeInfo={text('routeInfo', 'JR / 私鉄 / 新幹線')}
    lineNames={['Line Name 1', 'Line Name 2']}
    fast
    cheap
    easy
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
        # Description
        List Item for Jorudan mobile apps.
      `,
    },
  },
};
