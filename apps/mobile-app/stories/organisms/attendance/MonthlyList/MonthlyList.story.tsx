import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Component from '../../../../components/organisms/attendance/MonthlyList';

import * as props from './meta';

export default {
  title: 'Components/organisms/attendance',
  decorators: [withInfo],
};

export const MonthlyList = () => (
  // @ts-ignore
  <Component {...props} onClickItem={action('onClickListItem')} />
);

MonthlyList.parameters = {
  info: {
    inline: false,
    text: `
      勤務表の内容
    `,
  },
};
