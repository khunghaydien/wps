import * as React from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import Component from '@apps/mobile-app/components/molecules/approval/attendance/MonthlyListHeader';

export default {
  title: 'Components/molecules/approval/attendance',
  decorators: [withKnobs],
};

export const MonthlyListHeader = (): React.ReactNode => <Component />;
