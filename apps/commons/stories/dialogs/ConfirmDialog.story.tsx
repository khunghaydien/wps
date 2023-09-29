import React from 'react';

import { action } from '@storybook/addon-actions';

import ConfirmDialog from '../../components/dialogs/ConfirmDialog';

import DialogDecorator from '../../../../.storybook/decorator/Dialog';

export default {
  title: 'commons/dialogs',
  decorators: [
    (story: Function) => <DialogDecorator>{story()}</DialogDecorator>,
  ],
};

export const Basic = () => (
  <ConfirmDialog
    onClickCancel={action('キャンセルする操作')}
    onClickOk={action('OKする操作')}
  >
    人生をやり直しすチャンスです!
  </ConfirmDialog>
);

Basic.storyName = 'ConfirmDialog';

Basic.parameters = {
  info: {
    text: '人生を異世界でやり直しますか?',
    propTables: [ConfirmDialog],
    inline: false,
    source: true,
  },
};

export const ConfirmDialog複数行 = () => (
  <ConfirmDialog
    onClickCancel={action('キャンセルする操作')}
    onClickOk={action('OKする操作')}
  >
    {'人生をやり直しすチャンスです!\n異世界転生しますか?'}
  </ConfirmDialog>
);

ConfirmDialog複数行.storyName = 'ConfirmDialog - 複数行';

ConfirmDialog複数行.parameters = {
  info: {
    text: '人生を異世界でやり直しますか?',
    propTables: [ConfirmDialog],
    inline: false,
    source: true,
  },
};
