import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import EmptyIcon from '../../../components/molecules/commons/EmptyIcon';

export default {
  title: 'Components/molecules/commons/EmptyIcon',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <EmptyIcon message={text('message', 'リストは空です')} />
);

Basic.story = {
  parameters: {
    info: {
      text: `
  # Description
  リストが空の際に表示するでっかいアイコンです。

  # message

  アイコンの直下に出すメッセージです。
      `,
    },
  },
};
