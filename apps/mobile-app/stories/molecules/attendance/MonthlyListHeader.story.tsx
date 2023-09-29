import React from 'react';

import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/molecules/attendance/MonthlyListHeader';

export default {
  title: 'Components/molecules/attendance',
  decorators: [withKnobs, withInfo],
};

export const MonthlyListHeader = () => <Component />;
MonthlyListHeader.parameters = {
  info: {
    text: `
        # Description

        勤務表のリストヘッダーとコンポーネントです。
      `,
  },
};
