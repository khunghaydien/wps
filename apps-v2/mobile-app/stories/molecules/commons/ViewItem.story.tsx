import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import ViewItem from '../../../components/molecules/commons/ViewItem';

export default {
  title: 'Components/molecules/commons/ViewItem',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <ViewItem
    label={text('label', 'LABEL LABEL LABEL LABEL LABEL LABEL LABEL')}
    emphasis={boolean('emphasis', null)}
  >
    表示用
  </ViewItem>
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    要素表示用のコンポーネントです
    childrenで渡された値をそのまま表示します

    # ラベル

    \`label\` props で必ずラベルを指定して下さい。

    ## 強調ラベル

    \`emphasis\` を \`true\` にするとラベルの見出しが強調されます。
    \`required\` と併用することもできます。

    ~~~js
    <ViewItem
      label="label"
      emphasis
    />

    ~~~
      `,
    },
  },
};
