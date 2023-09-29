import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import MonthlyList from '@mobile/components/organisms/attendance/MonthlyList';

import * as props from './meta';

export default {
  title: 'Components/organisms/attendance',
  decorators: [withInfo],
};

export const _MonthlyList = (): React.ReactNode => (
  <MonthlyList
    {...props}
    onClickItem={action('onClickListItem')}
    useFixDailyRequest={false}
  />
);

_MonthlyList.storyName = 'MonthlyList';

_MonthlyList.parameters = {
  info: {
    inline: false,
    text: `
      勤務表の内容
    `,
  },
};
