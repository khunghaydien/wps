import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Component from '../../../components/pages/attendance/TimesheetMonthlyPage';

import { items as records } from '../../organisms/attendance/MonthlyList/meta';

export default {
  title: 'Components/pages/attendance',
  decorators: [withInfo],
};

export const TimesheetMonthlyPage = () => (
  <Component
    currentDate="2018-10-10"
    yearMonthOptions={[
      { value: '2018-09-01', label: '2018-09' },
      { value: '2018-10-01', label: '2018-10' },
      { value: '2018-11-01', label: '2018-11' },
    ]}
    // @ts-ignore
    records={records}
    onChangeMonth={action('onChageMonth')}
    onClickMonthlyListItem={action('onClickMonthlyListItem')}
    onClickRefresh={action('onClickRefresh')}
    onClickPrevMonth={action('onClickPrevMonth')}
    onClickNextMonth={action('onClickNextMonth')}
  />
);

TimesheetMonthlyPage.storyName = 'TimesheetMonthlyPage';
TimesheetMonthlyPage.parameters = {
  info: {
    inline: false,
    text: `
      勤務表
    `,
  },
};
