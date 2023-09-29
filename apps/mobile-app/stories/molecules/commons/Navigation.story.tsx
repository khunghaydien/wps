import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Navigation from '../../../components/molecules/commons/Navigation';

import TextButton from '../../../components/atoms/TextButton';

export default {
  title: 'Components/molecules/commons/Navigation',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  inline: false,
  text: `
  # Description

  アプリケーションのナビゲーションに使われるコンポーネントです。

  # onClickBack

  \`onClickBack\` handler を使って一つ前の画面に戻る操作を制御できます。

  # actions

  ナビゲーションにアクションを追加します。
  アクションには \`IconButton\` か \`TextButton\` を使うことを想定しています。
  これ以外のコンポーネントが使用された場合にはDesing Guildelineに違反するので注意してください。
`,
})(() => (
  <Navigation
    title={text(
      'title',
      'title title title title title title title title title title'
    )}
    backButtonLabel={text('backButtonLabel', '2018/1')}
    onClickBack={action('onClickBack')}
    actions={[<TextButton>Submit</TextButton>]}
  />
));
