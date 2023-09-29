/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';

import { ArrowRightButton } from '../index';

export default {
  title: 'core/ArrowRightButton',
};

export const Default = () => <ArrowRightButton onClick={action('onClick')} />;

Default.storyName = 'default';
