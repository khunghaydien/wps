import React from 'react';

import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

import MonthlyListHeader from '../../../../components/organisms/attendance/MonthlyList/MonthlyListHeader';

export default {
  title: 'Components/organisms/attendance/MonthlyList',
  decorators: [withKnobs, withInfo],
};

export const _MonthlyListHeader = (): React.ReactNode => <MonthlyListHeader />;

_MonthlyListHeader.storyName = 'MonthlyListHeader';

_MonthlyListHeader.parameters = {
  info: {
    text: `
      # Description

      勤務表のリストヘッダーとコンポーネントです。
    `,
  },
};
