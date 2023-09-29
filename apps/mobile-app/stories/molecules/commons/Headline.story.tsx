import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Headline from '../../../components/molecules/commons/Headline';

export default {
  title: 'Components/molecules/commons/Headline',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  inline: false,
  text: `
        # Description

        ナビゲーションが不要なページのタイトルに使われるコンポーネントです。
        画面の最上部に固定されます。
      `,
})(() => (
  <Headline
    title={text(
      'title',
      'title title title title title title title title title title title title title'
    )}
  />
));
