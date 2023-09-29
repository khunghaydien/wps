import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import FormForLeave from '../FormForLeave';
import * as dummyLeaveRequests from './mock-data/leaveRequests';

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FormForLeave',
  decorators: [withKnobs],
};

export const FullDaysLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={boolean('hasRange', false)}
    targetRequest={dummyLeaveRequests.rangeDay}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
FullDaysLeave.storyName = 'Full Day Leave';

export const FullDayLeaveReadOnly = () => (
  <FormForLeave
    isReadOnly
    hasRange={boolean('hasRange', false)}
    targetRequest={dummyLeaveRequests.rangeDay}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
FullDayLeaveReadOnly.storyName = 'Full Day Leave（Read Only）';

export const FirstHalfOfDayLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeAM}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
FirstHalfOfDayLeave.storyName = 'First Half of Day Leave';

export const FirstHalfOfDayLeaveReadOnly = () => (
  <FormForLeave
    isReadOnly
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeAM}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
FirstHalfOfDayLeaveReadOnly.storyName = 'First Half of Day Leave（Read Only）';

export const HalfDayLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeHalf}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

export const HalfDayLeaveReadOnly = () => (
  <FormForLeave
    isReadOnly
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeHalf}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
HalfDayLeaveReadOnly.storyName = 'Half Day Leave（Read Only）';

export const HourlyLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeTime}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

export const HourlyLeaveReadOnly = () => (
  <FormForLeave
    isReadOnly
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeTime}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

HourlyLeaveReadOnly.storyName = 'Hourly Leave（Read Only）';

export const DaysManagedLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.daysManagedWith0}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

export const NotDaysManagedLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.notDaysManaged}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

export const WithDetail = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.withDetail}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

export const WithDetailReadOnly = () => (
  <FormForLeave
    isReadOnly={true}
    hasRange={false}
    targetRequest={dummyLeaveRequests.withDetail}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
WithDetailReadOnly.storyName = 'With Detail（Read Only）';

export const WithReason = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.AbsenceWithReason}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

export const WithReasonReadOnly = () => (
  <FormForLeave
    isReadOnly={true}
    hasRange={false}
    targetRequest={dummyLeaveRequests.AbsenceWithReason}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
WithReasonReadOnly.storyName = 'With Reason（Read Only）';
