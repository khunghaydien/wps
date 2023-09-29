import React, { FC } from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import ProxyIndicator from '../components/ProxyIndicator';

import imgPhotoBlank from '../images/photo_Blank.png';

export default {
  title: 'commons',
  decorators: [withInfo],
};

interface FCStory extends FC {
  storyName?: string;
  parameters?: unknown;
}

export const _ProxyIndicator: FCStory = () => (
  <ProxyIndicator
    employeePhotoUrl={imgPhotoBlank}
    employeeName="田中 太郎"
    onClickExitButton={action('exit')}
    standalone={false}
  />
);

_ProxyIndicator.storyName = 'ProxyIndicator';
_ProxyIndicator.parameters = {
  info: {
    propTables: [ProxyIndicator],
    inline: true,
    source: true,
  },
};
