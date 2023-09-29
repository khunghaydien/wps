import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForAbsence from '../FormForAbsence';
import { OneDay, Range } from './mock-data/absenceRequests';

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FormForAbsence',
  parameters: {
    info: { propTables: [FormForAbsence], inline: true, source: true },
  },
};

export const _OneDay = () => (
  <FormForAbsence
    isReadOnly={false}
    hasRange={false}
    targetRequest={OneDay}
    onUpdateHasRange={action('UpdatedHasRange')}
    onUpdateValue={action('Updated')}
  />
);

_OneDay.storyName = 'one day';

export const OneDayReadOnly = () => (
  <FormForAbsence
    isReadOnly
    targetRequest={OneDay}
    hasRange={false}
    onUpdateHasRange={action('UpdatedHasRange')}
    onUpdateValue={action('Updated')}
  />
);

OneDayReadOnly.storyName = 'one day（Read Only）';

export const RangeDays = () => (
  <FormForAbsence
    isReadOnly={false}
    hasRange
    targetRequest={Range}
    onUpdateHasRange={action('UpdatedHasRange')}
    onUpdateValue={action('Updated')}
  />
);

RangeDays.storyName = 'range days';

export const RangeDaysReadOnly = () => (
  <FormForAbsence
    isReadOnly
    hasRange
    targetRequest={Range}
    onUpdateHasRange={action('UpdatedHasRange')}
    onUpdateValue={action('Updated')}
  />
);

RangeDaysReadOnly.storyName = 'range days（Read Only）';
