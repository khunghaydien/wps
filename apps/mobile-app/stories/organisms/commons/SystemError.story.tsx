import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import SystemError from '../../../components/organisms/commons/SystemError';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/organisms',
  decorators: [withKnobs, withInfo],
};

export const _SystemError: FCStory = () => (
  <SystemError
    continue={boolean('continue', false)}
    message={text(
      'message',
      'MESSAGE MESSAGE MESSAGE MESSAGE MESSAGE \n (THIS IS FATAL ERROR. THIS IS FATAL ERROR.)'
    )}
    solution={text(
      'solution',
      'SOLUTION SOLUTION SOLUTION SOLUTION SOLUTION SOLUTION SOLUTION'
    )}
    showError={boolean('showError', true)}
    resetError={action('resetError')}
  />
);

_SystemError.storyName = 'SystemError';
_SystemError.parameters = {
  info: {
    inline: false,
    text: `
      Display system error
    `,
  },
};
