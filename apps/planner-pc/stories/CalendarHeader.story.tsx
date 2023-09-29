import React, { ReactElement } from 'react';

import { action } from '@storybook/addon-actions';

import CalendarHeader from '../components/CalendarHeader';

export default {
  title: 'planner-pc',
};

export const _CalendarHeader = (): ReactElement => (
  <CalendarHeader
    dateList={[
      { value: '2018/05' },
      { value: '2018/04' },
      { value: '2018/03' },
    ]}
    date="2018/05"
    calendarMode="week"
    onClickToday={action('onClickToday')}
    onClickNext={action('onClickNext')}
    onClickPrevious={action('onClickPrevious')}
    onSelectDate={action('onSelectDate')}
    onSelectCalendarMode={action('onSelectCalendarMode')}
  />
);

_CalendarHeader.storyName = 'CalendarHeader';
