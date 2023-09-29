import React from 'react';

import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import SystemConfirm from '../../../components/organisms/commons/SystemConfirm';

export default {
  title: 'Components/organisms',
  decorators: [withKnobs],
  parameters: {
    info: {
      text: `Display system alert `,
    },
  },
};

export const _SystemConfirm = () => {
  let fire = boolean('fire', false);
  const message = text('message', 'MESSAGE MESSAGE MESSAGE MESSAGE MESSAGE');

  return (
    // @ts-ignore
    <SystemConfirm
      message={fire ? message : ''}
      callback={(_: boolean) => {
        fire = false;
      }}
    />
  );
};

_SystemConfirm.storyName = 'SystemConfirm';
