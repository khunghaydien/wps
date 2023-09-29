import React from 'react';

import DailyTaskHeader from '../../../components/organisms/tracking/DailyTaskHeader';

export default {
  title: 'Components/organisms/tracking/DailyTaskHeader',
};

export const Default = () => (
  <DailyTaskHeader
    isTemporaryWorkTime={false}
    includesNonDirectInputTask
    timeOfAttendance={510}
    timeOfTimeTracking={510}
    totalRatio={100}
  />
);

Default.storyName = 'default';

export const NoTimeOfAttendance = () => (
  <DailyTaskHeader
    isTemporaryWorkTime={false}
    includesNonDirectInputTask
    timeOfAttendance={null}
    timeOfTimeTracking={510}
    totalRatio={100}
  />
);

NoTimeOfAttendance.storyName = 'no time of attendance';

export const Not100 = () => (
  <DailyTaskHeader
    isTemporaryWorkTime={false}
    includesNonDirectInputTask
    timeOfAttendance={510}
    timeOfTimeTracking={null}
    totalRatio={80}
  />
);

Not100.storyName = 'not 100%';

export const _0000 = () => (
  <DailyTaskHeader
    isTemporaryWorkTime={false}
    includesNonDirectInputTask
    timeOfAttendance={0}
    timeOfTimeTracking={0}
    totalRatio={100}
  />
);

_0000.storyName = '00:00';

export const TemporaryWorktime = () => (
  <DailyTaskHeader
    isTemporaryWorkTime
    includesNonDirectInputTask
    timeOfAttendance={0}
    timeOfTimeTracking={0}
    totalRatio={100}
  />
);

TemporaryWorktime.storyName = 'temporary worktime';
