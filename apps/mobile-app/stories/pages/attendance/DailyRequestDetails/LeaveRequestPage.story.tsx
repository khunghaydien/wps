import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import { defaultValue } from '../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/LeaveRequestPage';

import store from '../store.mock';

export default {
  // FIXME: Typo...
  title: 'Components/pages/attendance/DailyRequestDatails',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};

export const LeaveRequestPage = () => (
  // @ts-ignore
  <Component
    leaveTypeOptions={[{ label: 'TEST', value: 'a' }]}
    rangeOptions={[
      { label: '全日休', value: 'Day' },
      { label: '午前半日休', value: 'Half' },
      { label: '午後半日休', value: 'Half' },
      { label: '時間単位休', value: 'Time' },
    ]}
    onChange={action('onChange')}
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: 'Leave',
      id: 'ABC',
      daysLeft: null,
      hoursLeft: null,
      isDaysLeftManaged: true,
      availableLeaveTypes: [],
      requestTypeCode: 'Leave',
      requestTypeName: text('requestTypeName', '休暇'),
      status: text('status', 'NotRequested'),
      startDate: text('startDate', '2019-01-01'),
      endDate: text('endDate', '2019-12-31'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', 'AAA'),
      reason: text('reason', 'BBB'),
      leaveCode: text('leaveName', 'ab10101'),
      leaveName: text('leaveName', '全日休'),
      leaveType: text('leaveType', 'Paid'),
      leaveRange: text('leavelRange', 'Day'),
      requireReason: boolean('requireReason', false),
      originalRequestId: '',
      isForReapply: boolean('isForReapply', false),
      approver01Name: '',
      targetDate: text('targetDate', '2019-01-01'),
    }}
    selectedAttLeave={null}
    validation={{}}
  />
);

LeaveRequestPage.parameters = {
  info: {
    inline: false,
    text: `
      Leave Request
      休暇申請
    `,
  },
};
