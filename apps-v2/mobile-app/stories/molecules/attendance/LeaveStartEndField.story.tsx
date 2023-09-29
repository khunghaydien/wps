import React from 'react';

import { action } from '@storybook/addon-actions';
import { array, boolean, text, withKnobs } from '@storybook/addon-knobs';

import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { LeaveRange } from '@attendance/domain/models/LeaveRange';

import LeaveStartEndField from '../../../components/molecules/attendance/LeaveStartEndField';

const request = (leaveRange: LeaveRange) => ({
  type: CODE.Leave,
  leaveRange,
  startDate: '2019-01-01',
  endDate: '2019-01-05',
  leaveName: '',
  leaveCode: '',
  leaveType: null,
  availableLeaveTypes: [],
  daysLeft: 10,
  hoursLeft: 100,
  id: '',
  requestTypeCode: CODE.Leave,
  requestTypeName: '休暇',
  status: 'NotRequested',
  startTime: null,
  endTime: null,
  remarks: '',
  reason: '',
  substituteLeaveType: null,
  substituteDate: '',
  directApplyRestTimes: [],
  patternCode: '',
  patternName: '',
  patternRestTimes: [],
  requireReason: false,
  originalRequestId: '',
  isForReapply: false,
  approver01Name: '',
  // FIXME: 各種申請ごとのモデルになったら削除されます。
  targetDate: '',
});

export default {
  title: 'Components/molecules/attendance/LeaveStartEndField',
  decorators: [withKnobs],
  parameters: {
    info: {
      text: `
      # Description

      休暇範囲ごとの入力フィールド

    `,
    },
  },
};

export const Day = () => (
  <LeaveStartEndField
    testId={text('testId', 'unique-id')}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    onChange={action('onChange')}
    // @ts-ignore
    request={request('Day')}
    isDaysLeftManaged={false}
  />
);

export const Half = () => (
  <LeaveStartEndField
    testId={text('testId', 'unique-id')}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    onChange={action('onChange')}
    // @ts-ignore
    request={request('Half')}
    isDaysLeftManaged={false}
  />
);

export const Time = () => (
  <LeaveStartEndField
    testId={text('testId', 'unique-id')}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    onChange={action('onChange')}
    // @ts-ignore
    request={request('Time')}
    isDaysLeftManaged={false}
  />
);

export const ManagedDaysLeft = () => (
  <LeaveStartEndField
    testId={text('testId', 'unique-id')}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    onChange={action('onChange')}
    // @ts-ignore
    request={request('Time')}
    isDaysLeftManaged
    errors={array('errors', ['ERROR'])}
  />
);

ManagedDaysLeft.storyName = 'Time - isDaysLeftManaged: true';
