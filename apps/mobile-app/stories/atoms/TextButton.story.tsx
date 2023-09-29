import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, withKnobs } from '@storybook/addon-knobs';

import TextButton from '../../components/atoms/TextButton';

export default {
  title: 'Components/atoms/TextButton',
  decorators: [withKnobs],
};

export const Basic = () => (
  <TextButton
    disabled={boolean('disabled', null)}
    onClick={action('onClick')}
    testId="unique-id"
  >
    +休暇を追加
  </TextButton>
);

Basic.parameters = {
  info: {
    text: `
    # Normal

    ~~~js
    <TextButton>TEXT</TextButton>
    ~~~

    # Disabled

    \`disabled\`を\`true\`にすると\`TextButton\`が非活性になります。

    ~~~js
    <TextButton disabled />
    ~~~

    # E2E テスト

    E2Eテストのために\`testId\` prop に一意なIDを渡してください。
    これにより\`TextButton\`が常に一意に特定できる事をE2Eテストに保障すること出来ます。
  `,
  },
};
