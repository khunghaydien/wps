/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';

import { CloseButton } from '../index';

export default {
  title: 'core/CloseButton',
};

export const Default = () => <CloseButton onClick={action('onClick')} />;

Default.storyName = 'default';
