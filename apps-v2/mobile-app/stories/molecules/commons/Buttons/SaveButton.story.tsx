import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

/* eslint-disable import/no-extraneous-dependencies */
import SaveButton from '../../../../components/molecules/commons/Buttons/SaveButton';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Buttons',
  decorators: [withKnobs, withInfo],
};

export const _SaveButton: FCStory = () => (
  <SaveButton
    testId={text('testId', 'unique-id')}
    onClick={action('onClick')}
    disabled={boolean('disabled', false)}
  />
);

_SaveButton.storyName = 'SaveButton';
_SaveButton.parameters = {
  info: {
    text: `
      # Description

      A Button to save something.
    `,
  },
};
