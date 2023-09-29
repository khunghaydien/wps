import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import EmptyIcon from '../../../components/molecules/commons/EmptyIcon';

export default {
  title: 'Components/molecules/commons/EmptyIcon',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  inline: false,
  text: `
  # Description
  リストが空の際に表示するでっかいアイコンです。

  # message 

  アイコンの直下に出すメッセージです。
`,
})(() => <EmptyIcon message={text('message', 'リストは空です')} />);
