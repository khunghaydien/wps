import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/AbsenceRequestPage';

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

export const AbsenceRequestPage = () => (
  <Component
    onChangeEndDate={action('onChangeEndDate')}
    onChangeReason={action('onChangeReason')}
    readOnly={boolean('readOnly', false)}
    request={{
      type: 'Absence',
      id: 'ABC',
      daysLeft: null,
      hoursLeft: null,
      availableLeaveTypes: [],
      requestTypeCode: 'Absence',
      requestTypeName: text('requestTypeName', '欠勤'),
      // @ts-ignore
      status: text('status', 'NotRequested'),
      startDate: text('startDate', '2019-01-01'),
      endDate: text('endDate', '2019-12-31'),
      startTime: null,
      endTime: null,
      remarks: '',
      reason: text('reason', 'Awesome reason of 2-month absence'),
      leaveCode: null,
      leaveName: null,
      leaveType: null,
      leaveRange: null,
      substituteLeaveType: null,
      substituteDate: '',
      directApplyRestTimes: [],
      patternCode: '',
      patternName: '',
      patternRestTimes: [],
      originalRequestId: '',
      requireReason: false,
      isForReapply: boolean('isForReapply', false),
      approver01Name: '',
      targetDate: text('targetDate', '2019-01-01'),
    }}
    validation={{}}
  />
);

AbsenceRequestPage.parameters = {
  info: {
    inline: false,
    text: `
      Absence Request
      欠勤申請
    `,
  },
};
