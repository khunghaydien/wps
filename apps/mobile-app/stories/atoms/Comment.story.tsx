import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Comment from '../../components/atoms/Comment';

export default {
  title: 'Components/atoms/Comment',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    Comment コンポーネント

    # Propsについて

    Positionで吹き出しの位置を変更できます。
    現在、leftとrightのみ
  `)(() => (
  <Comment position={'left'} value={text('value', 'Value Value Value Value')} />
));
