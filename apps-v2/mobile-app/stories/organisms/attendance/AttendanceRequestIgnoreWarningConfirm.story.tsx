import React from 'react';

import { action } from '@storybook/addon-actions';
import { array, withKnobs } from '@storybook/addon-knobs';

import Component from '@mobile/components/organisms/attendance/AttendanceRequestIgnoreWarningConfirm';

export default {
  title: 'Components/organisms/attendance',
  decorators: [withKnobs],
};

export const AttendanceRequestIgnoreWarningConfirm = (): React.ReactNode => (
  <Component
    messages={array('messages', ['Message 1', 'Message 2', 'Message 3'], ',')}
    callback={action('callback')}
  />
);
