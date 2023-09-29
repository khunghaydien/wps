import * as React from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import STATUS from '@apps/domain/models/approval/request/Status';

import $AttendanceRequestStatus from '@mobile/components/molecules/attendance/AttendanceRequestStatus';

export default {
  title: 'Components/molecules/attendance',
  decorators: [withKnobs],
};

export const AttendanceRequestStatus = (): React.ReactNode => (
  <div>
    <div>
      <$AttendanceRequestStatus status={STATUS.NotRequested} />
    </div>
    <div>
      <$AttendanceRequestStatus status={STATUS.Pending} />
    </div>
    <div>
      <$AttendanceRequestStatus status={STATUS.Approved} />
    </div>
    <div>
      <$AttendanceRequestStatus status={STATUS.Rejected} />
    </div>
    <div>
      <$AttendanceRequestStatus status={STATUS.Recalled} />
    </div>
    <div>
      <$AttendanceRequestStatus status={STATUS.Canceled} />
    </div>
  </div>
);
