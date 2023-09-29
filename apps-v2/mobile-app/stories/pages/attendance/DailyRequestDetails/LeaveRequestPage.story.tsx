import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import {
  defaultValue,
  STATUS,
  Status,
} from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { Leave } from '@attendance/domain/models/Leave';
import { LEAVE_RANGE, LeaveRange } from '@attendance/domain/models/LeaveRange';
import { LEAVE_TYPE } from '@attendance/domain/models/LeaveType';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/LeaveRequestPage';

import store from '../store.mock';
import createFactory from '@attendance/domain/factories/dailyRequest/LeaveRequestFactory/Default';

const Factory = createFactory();

const leaves = createMapByCode([
  {
    code: 'annual',
    name: '年次有給休暇',
    type: LEAVE_TYPE.Annual,
    ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.AM, LEAVE_RANGE.PM, LEAVE_RANGE.Time],
    details: createMapByCode([
      {
        code: 'detail1',
        name: '内訳1',
        ranges: [
          LEAVE_RANGE.Day,
          LEAVE_RANGE.AM,
          LEAVE_RANGE.PM,
          LEAVE_RANGE.Time,
        ],
      },
      {
        code: 'detail2',
        name: '内訳2',
        ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.Time],
      },
    ]),
    daysLeft: null,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    requireReason: false,
  },
  {
    code: 'ab10101',
    name: '有給休暇',
    type: LEAVE_TYPE.Paid,
    ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.AM, LEAVE_RANGE.PM, LEAVE_RANGE.Time],
    details: null,
    daysLeft: null,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    requireReason: false,
  },
  {
    code: 'ab10102',
    name: '有給休暇（理由あり）',
    type: LEAVE_TYPE.Paid,
    ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.AM, LEAVE_RANGE.PM, LEAVE_RANGE.Time],
    details: null,
    daysLeft: null,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    requireReason: true,
  },
  {
    code: 'ab10203',
    name: '年次有給休暇（日数・時間管理）',
    type: LEAVE_TYPE.Annual,
    ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.AM, LEAVE_RANGE.PM, LEAVE_RANGE.Time],
    details: null,
    daysLeft: 1,
    hoursLeft: 2,
    timeLeaveDaysLeft: 3,
    timeLeaveHoursLeft: 4,
    requireReason: true,
  },
] as Leave[]);

export default {
  // FIXME: Typo...
  title: 'Components/pages/attendance/DailyRequestDetails/LeaveRequestPage',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};

export const Default = () => (
  // @ts-ignore
  <Component
    onChange={action('onChange')}
    readOnly={boolean('readOnly', false)}
    request={Factory.create({
      ...defaultValue,
      type: 'Leave',
      id: 'ABC',
      requestTypeCode: 'Leave',
      requestTypeName: '休暇',
      status: text('status', 'NotRequested') as Status,
      startDate: text('startDate', '2019-01-01'),
      endDate: text('endDate', '2019-12-31'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', 'AAA'),
      reason: text('reason', 'BBB'),
      isForReapply: boolean('isForReapply', false),
      originalRequestId: '',
      approver01Name: '',
      leaveCode: text('leaveCode', 'annual'),
      leaveDetailCode: text('leaveDetailCode', 'detail1'),
      leaveRange: text('leaveRange', LEAVE_RANGE.Day) as LeaveRange,
      leaves,
    })}
    validation={{}}
  />
);

export const ShowReason = () => (
  // @ts-ignore
  <Component
    onChange={action('onChange')}
    readOnly={false}
    request={Factory.create({
      ...defaultValue,
      type: 'Leave',
      id: 'ABC',
      requestTypeCode: 'Leave',
      requestTypeName: '休暇',
      status: STATUS.NOT_REQUESTED,
      startDate: '2019-01-01',
      endDate: '2019-12-31',
      startTime: 0,
      endTime: 0,
      remarks: 'AAA',
      reason: 'BBB',
      isForReapply: false,
      originalRequestId: '',
      approver01Name: '',
      leaveCode: 'ab10102',
      leaveDetailCode: null,
      leaves,
    })}
    validation={{}}
  />
);

export const IsDaysAndTimeLeftManaged = () => (
  // @ts-ignore
  <Component
    onChange={action('onChange')}
    readOnly={false}
    request={Factory.create({
      ...defaultValue,
      type: 'Leave',
      id: 'ABC',
      requestTypeCode: 'Leave',
      requestTypeName: '休暇',
      status: STATUS.NOT_REQUESTED,
      startDate: '2019-01-01',
      endDate: '2019-12-31',
      startTime: 0,
      endTime: 0,
      remarks: 'AAA',
      reason: 'BBB',
      isForReapply: false,
      originalRequestId: '',
      approver01Name: '',
      leaveCode: 'ab10203',
      leaveDetailCode: null,
      leaveRange: LEAVE_RANGE.Time,
      leaves,
    })}
    validation={{}}
  />
);

export const IsForReapply = () => (
  // @ts-ignore
  <Component
    onChange={action('onChange')}
    readOnly={false}
    request={Factory.create({
      ...defaultValue,
      type: 'Leave',
      id: 'ABC',
      requestTypeCode: 'Leave',
      requestTypeName: '休暇',
      status: STATUS.CANCELED,
      startDate: '2019-01-01',
      endDate: '2019-12-31',
      startTime: 0,
      endTime: 0,
      remarks: 'AAA',
      reason: 'BBB',
      isForReapply: true,
      originalRequestId: '',
      approver01Name: '',
      leaveCode: 'ab10101',
      leaveDetailCode: null,
      leaves,
    })}
    validation={{}}
  />
);
