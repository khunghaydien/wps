import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import CommentArea from '../../../components/molecules/commons/CommentArea';

import ImgSample from '../../images/sample.png';

export default {
  title: 'Components/molecules/commons/CommentArea',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <CommentArea
    src={ImgSample}
    alt="sample"
    value={text('value', 'Value Value Value Value')}
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    CommentArea コンポーネント
    顔アイコンと吹き出しのセットです。

    ~~~js
    <TextArea
      error
    />
    ~~~
      `,
    },
  },
};
