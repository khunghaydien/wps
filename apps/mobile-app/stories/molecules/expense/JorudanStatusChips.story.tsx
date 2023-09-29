import React from 'react';

import { withInfo } from '@storybook/addon-info';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import JorudanStatusChips from '../../../components/molecules/expense/JorudanStatusChips';

export default {
  title: 'Components/molecules/expense/JorudanStatusChips',
  decorators: [
    withKnobs,
    (story: (...args: Array<any>) => any) => <div>{story()}</div>,
  ],
};

export const Basic = withInfo({
  text: `
        # Description

        ジョルダンで各条件を満たした際に表示されるアイコンを簡単に表示するためのコンポーネントです。
      `,
})(() => (
  <JorudanStatusChips
    isCheapest={boolean('isCheapest', true)}
    isEarliest={boolean('isEarliest', true)}
    isMinTransfer={boolean('isMinTransfer', true)}
    verticalRow={boolean('verticalRow', false)}
  />
));
