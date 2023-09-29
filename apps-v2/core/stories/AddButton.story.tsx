/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';

import { AddButton } from '../index';

export default {
  title: 'core/AddButton',
};

export const Default = () => <AddButton onClick={action('onClick')} />;

Default.storyName = 'default';
