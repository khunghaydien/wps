import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import RefreshButton from '../../../../components/molecules/commons/Buttons/RefreshButton';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Buttons',
  decorators: [withKnobs, withInfo],
};

export const _RefreshButton: FCStory = () => (
  <RefreshButton
    testId={text('testId', 'unique-id')}
    className={text('className', 'className')}
    onClick={action('onClick')}
    type={text('type', 'submit')}
    disabled={boolean('disabled', false)}
  />
);

_RefreshButton.storyName = 'RefreshButton';
_RefreshButton.parameters = {
  info: {
    text: `
      # Description

      A Button to refresh data.
    `,
  },
};
