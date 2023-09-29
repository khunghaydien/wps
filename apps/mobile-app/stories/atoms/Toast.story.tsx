import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Toast from '../../components/atoms/Toast';

export default {
  title: 'Components/atoms/Toast',
  decorators: [withKnobs],
};

export const Basic = () => {
  return (
    <Toast
      message={text('message', '申請しました')}
      isShow={boolean('isShow', true)}
    />
  );
};

Basic.parameters = {
  info: `
    # Description

    申請完了や、保存完了時に表示するトーストです
  `,
};
