/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';

import { ArrowLeftButton } from '../index';

export default {
  title: 'core/ArrowLeftButton',
};

export const Default = () => <ArrowLeftButton onClick={action('onClick')} />;

Default.storyName = 'default';
