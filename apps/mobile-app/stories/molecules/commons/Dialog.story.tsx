import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Dialog from '../../../components/molecules/commons/Dialog';

export default {
  title: 'Components/molecules/commons/Dialog',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  inline: false,
  text: `
        # Description

        Basic Dialog
      `,
})(() => (
  <Dialog
    title={text('title', '申請してよろしいですか')}
    content={
      <div>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium
        pariatur iure fuga autem iusto doloremque totam fugiat illo architecto
        nemo omnis cum veritatis, neque maiores. Atque autem neque molestias
        distinctio!
      </div>
    }
    leftButtonLabel={text('leftButtonLabel', 'キャンセル')}
    onClickLeftButton={() => {}}
    rightButtonLabel={text('rightButtonLabel', '申請する')}
    onClickRightButton={() => {}}
    onClickCloseButton={action('onClickCloseButton')}
  />
));
