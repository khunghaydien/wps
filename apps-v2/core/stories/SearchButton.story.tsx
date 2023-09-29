import React from 'react';

import { action } from '@storybook/addon-actions';

import { SearchButton } from '../index';

export default {
  title: 'core/SearchButton',
};

export const Default = () => <SearchButton onClick={action('onClick')} />;

Default.storyName = 'default';
