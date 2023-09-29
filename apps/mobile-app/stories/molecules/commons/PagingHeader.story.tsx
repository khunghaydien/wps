import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import PagingHeader from '../../../components/molecules/commons/PagingHeader';

export default {
  title: 'Components/molecules/commons/PagingHeader',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  inline: false,
  text: `
  # Description

  アプリケーションのヘッダーに使われるコンポーネントです。

  # onClickPrev, onClickNext

  \`onClickPrev\` handler を使って前のページに移動する操作を制御できます。

  \`onClickPrev\` handler を使って次のページに移動する操作を制御できます。

`,
})(() => (
  <PagingHeader
    prevButtonLabel={text('prevButtonLabel', 'Prev')}
    nextButtonLabel={text('nextButtonLabel', 'Next')}
    disabledPrevButton={boolean('disabledPrevButton', false)}
    disabledNextButton={boolean('disabledNextButton', false)}
    onClickPrev={action('onClickPrev')}
    onClickNext={action('onClickNext')}
  >
    {text(
      'chilren',
      'title title title title title title title title title title'
    )}
  </PagingHeader>
));
