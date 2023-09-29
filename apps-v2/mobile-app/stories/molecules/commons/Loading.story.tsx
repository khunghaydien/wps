import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Loading from '../../../components/molecules/commons/Loading';

export default {
  title: 'Components/molecules/commons/Loading',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <Loading theme={'light'} text={text('text', '読み込み中')} />
);

Basic.story = {
  parameters: {
    info: {
      text: `
ページを開いている間・データを更新している間などに表示されるローディングです。
      `,
    },
  },
};

export const Themes = () => (
  <Loading theme={'dark'} text={text('text', '申請中')} />
);

Themes.story = {
  parameters: {
    info: {
      text: `
light・dark theme が選べます。
      `,
    },
  },
};
