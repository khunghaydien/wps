import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, select, withKnobs } from '@storybook/addon-knobs';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

import Component from '@mobile/components/molecules/approval/attendance/MonthlyListItem';

export default {
  title: 'Components/molecules/approval/attendance',
  decorators: [withKnobs],
};

export const MonthlyListItem = (): React.ReactNode => (
  <>
    <Component
      dayType={select(
        'dayType',
        {
          Workday: DAY_TYPE.Workday,
          Holiday: DAY_TYPE.Holiday,
          'Legal Holiday': DAY_TYPE.LegalHoliday,
        },
        DAY_TYPE.Workday
      )}
      date={'2020-01-01'}
      startTime={number('startTime', 8 * 60)}
      endTime={number('endTime', 17 * 60)}
      startTimeModified={boolean('startTimeModified', true)}
      endTimeModified={boolean('endTimeModified', true)}
      onClick={action('onClick')}
      attention={boolean('attention', true)}
    />
    <Component
      dayType={DAY_TYPE.Workday}
      date={'2020-01-02'}
      startTime={number('startTime', 8 * 60)}
      endTime={number('endTime', 17 * 60)}
      startTimeModified={false}
      endTimeModified={false}
      onClick={action('onClick')}
      attention={true}
    />
    <Component
      dayType={DAY_TYPE.Holiday}
      date={'2020-01-03'}
      startTime={number('startTime', 8 * 60)}
      endTime={number('endTime', 17 * 60)}
      startTimeModified={true}
      endTimeModified={false}
      onClick={action('onClick')}
      attention={false}
    />
    <Component
      dayType={DAY_TYPE.LegalHoliday}
      date={'2020-01-03'}
      startTime={number('startTime', 8 * 60)}
      endTime={number('endTime', 17 * 60)}
      startTimeModified={false}
      endTimeModified={true}
      onClick={action('onClick')}
      attention={false}
    />
  </>
);
