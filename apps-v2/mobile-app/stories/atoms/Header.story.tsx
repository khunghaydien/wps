import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { withKnobs } from '@storybook/addon-knobs';

import Header from '../../components/atoms/Header';

export default {
  title: 'Components/atoms/Header',
  decorators: [withKnobs],
};

export const Basic = () => <Header level={1}>HEADER</Header>;

Basic.parameters = {
  info: `
      # Description

      ナビゲーションや見出しを表示するためのヘッダーコンポーネント。
      levelが1の場合には画面の最上部に固定されます。
    `,
};
