import React from 'react';

import { action } from '@storybook/addon-actions';

import ErrorDialog from '../../components/dialogs/ErrorDialog';

import DialogDecorator from '../../../../.storybook/decorator/Dialog';
import BaseWSPError from '../../errors/BaseWSPError';

export default {
  title: 'commons/dialogs',
  decorators: [(story) => <DialogDecorator>{story()}</DialogDecorator>],
};

export const Basic = () => (
  <ErrorDialog
    error={
      new BaseWSPError(
        'データ不正エラー',
        '予期せぬエラーです',
        'システム管理者にお問い合わせください',
        undefined,
        undefined
      )
    }
    handleClose={action('閉じる操作')}
  />
);

Basic.storyName = 'ErrorDialog';

Basic.parameters = {
  info: {
    text: '回復方法あり',
    propTables: [ErrorDialog],
    inline: false,
    source: true,
  },
};

export const ErrorDialog複数行 = () => (
  <ErrorDialog
    error={
      new BaseWSPError(
        'データ不正エラー',
        '勤務体系が設定されていないため、勤務表を表示できませんでした',
        'システム管理者にお問い合わせください',
        undefined,
        undefined
      )
    }
    handleClose={action('閉じる操作')}
  />
);

ErrorDialog複数行.storyName = 'ErrorDialog - 複数行';

ErrorDialog複数行.parameters = {
  info: {
    text: '回復方法あり',
    propTables: [ErrorDialog],
    inline: false,
    source: true,
  },
};

export const ErrorDialog回復方法無し = () => (
  <ErrorDialog
    error={
      new BaseWSPError(
        'データ不正エラー',
        '予期せぬエラーです',
        undefined,
        undefined,
        undefined
      )
    }
    handleClose={action('閉じる操作')}
  />
);

ErrorDialog回復方法無し.storyName = 'ErrorDialog - 回復方法無し';

ErrorDialog回復方法無し.parameters = {
  info: {
    text: '回復方法無し',
    propTables: [ErrorDialog],
    inline: false,
    source: true,
  },
};
