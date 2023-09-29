import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { array, withKnobs } from '@storybook/addon-knobs';

import Errors from '../../components/atoms/Errors';

export default {
  title: 'Components/atoms/Errors',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <Errors
    messages={array('messages', ['Errror Message #1', 'Errror Message #2'])}
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
  # Description

  エラーメッセージを表示します。
      `,
    },
  },
};
