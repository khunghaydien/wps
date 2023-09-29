import React from 'react';

import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import SystemAlert from '../../../components/organisms/commons/SystemAlert';

export default {
  title: 'Components/organisms',
  decorators: [withKnobs],
};

export const _SystemAlert = () => {
  let fire = boolean('fire', false);
  const message = text('message', 'MESSAGE MESSAGE MESSAGE MESSAGE MESSAGE');

  return (
    // @ts-ignore
    <SystemAlert
      message={fire ? message : ''}
      callback={() => {
        fire = false;
      }}
    />
  );
};

_SystemAlert.storyName = 'SystemAlert';

_SystemAlert.parameters = {
  info: `Display system alert `,
};
