import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import IconButton from '../../components/atoms/IconButton';

export default {
  title: 'Components/atoms/IconButton',
  decorators: [withKnobs],
};

export const Basic = () => (
  <IconButton
    icon={text('icon', 'adduser')}
    disabled={boolean('disabled', null)}
    onClick={action('onClick')}
    testId="unique-id"
  />
);
