import React from 'react';

import { action } from '@storybook/addon-actions';

import Footer from '../Footer';

export default {
  title: 'attendance/daily-allowance/Footer',
};

export const WhileLoading = () => (
  <Footer
    isLoading
    isLocked={false}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

WhileLoading.storyName = 'while loading';

export const LoadingFalse = () => (
  <Footer
    isLoading={false}
    isLocked={false}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

LoadingFalse.storyName = 'loading false';

export const IsLocked = () => (
  <Footer
    isLoading={false}
    isLocked={true}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

IsLocked.storyName = 'save button is locked';
