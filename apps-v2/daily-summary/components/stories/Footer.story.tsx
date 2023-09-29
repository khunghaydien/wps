import React from 'react';

import { action } from '@storybook/addon-actions';

import Footer from '../Footer';

export default {
  title: 'daily-summary/Footer',
};

export const HasNoLeave = () => (
  <Footer
    isDelegated={false}
    isLoading={false}
    hasLeave={false}
    onSaveAndLeave={action('onSaveAndLeave')}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

HasNoLeave.storyName = 'hasNoLeave';

export const HasLeave = () => (
  <Footer
    isDelegated={false}
    isLoading={false}
    hasLeave
    onSaveAndLeave={action('onSaveAndLeave')}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

HasLeave.storyName = 'hasLeave';

export const WhileLoading = () => (
  <Footer
    isDelegated={false}
    isLoading
    hasLeave
    onSaveAndLeave={action('onSaveAndLeave')}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

WhileLoading.storyName = 'while loading';

export const IsDelegated = () => (
  <Footer
    isDelegated
    isLoading={false}
    hasLeave={false}
    onSaveAndLeave={action('onSaveAndLeave')}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

IsDelegated.storyName = 'is delegated';

export const ReadOnly = () => (
  <Footer
    readOnly
    isDelegated
    isLoading={false}
    hasLeave={false}
    onSaveAndLeave={action('onSaveAndLeave')}
    onSave={action('onSave')}
    onClose={action('onClose')}
  />
);

ReadOnly.storyName = 'read only';
