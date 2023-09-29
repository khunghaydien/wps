import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import FormForLeave from '../FormForLeave';
import * as dummyLeaveRequests from './mock-data/leaveRequests';

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog/FormForLeave',
  decorators: [withKnobs],
};

export const FullDaysLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={boolean('hasRange', false)}
    targetRequest={dummyLeaveRequests.rangeDay}
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
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
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
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
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
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
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
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
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

HalfDayLeave.storyName = 'Half Day Leave';

export const HalfDayLeaveReadOnly = () => (
  <FormForLeave
    isReadOnly
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeHalf}
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
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
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
HourlyLeave.storyName = 'Hourly Leave';

export const HourlyLeaveReadOnly = () => (
  <FormForLeave
    isReadOnly
    hasRange={false}
    targetRequest={dummyLeaveRequests.rangeTime}
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[0]}
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
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[1]}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);
DaysManagedLeave.storyName = 'Days Managed Leave';

export const NotDaysManagedLeave = () => (
  <FormForLeave
    isReadOnly={false}
    hasRange={false}
    targetRequest={dummyLeaveRequests.notDaysManaged}
    attLeaveList={dummyLeaveRequests.availableLeaveTypes}
    selectedAttLeave={dummyLeaveRequests.availableLeaveTypes[2]}
    onUpdateValue={action('Updated')}
    onUpdateHasRange={action('Updated')}
  />
);

NotDaysManagedLeave.storyName = 'Not Days Managed Leave';
