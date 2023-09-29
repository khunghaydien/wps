import * as React from 'react';

import { WorkingType } from '@apps/attendance/domain/models/WorkingType';
import { STATUS } from '@attendance/domain/models/AttDailyRequest';

import { ROW_TYPE } from '@mobile/modules/attendance/timesheet/entities';

import MonthlyList from '@mobile/components/organisms/attendance/MonthlyList';

type Props = React.ComponentProps<typeof MonthlyList>;

export const workingTypes: Props['workingTypes'] = [
  {
    startDate: '2010-01-01',
    endDate: '2010-01-31',
    useFixDailyRequest: false,
  } as unknown as WorkingType,
];

export const items: Props['items'] = [
  {
    rowType: ROW_TYPE.WORKDAY,
    recordDate: '2010-01-01',
    startTime: 60 * 9,
    endTime: 60 * 18,
    contractedDetail: {
      startTime: 60 * 9,
      endTime: 60 * 18,
    },
    remarkableRequestStatus: {
      count: 1,
      status: STATUS.APPROVAL_IN,
    },
    attentionMessages: ['テスト'],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.WORKDAY,
    recordDate: '2010-10-02',
    startTime: null,
    endTime: 60 * 18,
    contractedDetail: {
      startTime: 60 * 9,
      endTime: 60 * 18,
    },
    remarkableRequestStatus: {
      count: 1,
      status: STATUS.APPROVED,
    },
    attentionMessages: ['テスト'],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.WORKDAY,
    recordDate: '2010-01-10',
    startTime: 60 * 9,
    endTime: null,
    contractedDetail: {
      startTime: 60 * 9,
      endTime: 60 * 18,
    },
    remarkableRequestStatus: {
      count: 1,
      status: STATUS.CANCELED,
    },
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.WORKDAY,
    recordDate: '2010-11-11',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: 60 * 9,
      endTime: 60 * 18,
    },
    remarkableRequestStatus: {
      count: 1,
      status: STATUS.REJECTED,
    },
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.WORKDAY,
    recordDate: '2010-10-05',
    startTime: 0,
    endTime: 0,
    contractedDetail: {
      startTime: 60 * 9,
      endTime: 60 * 18,
    },
    remarkableRequestStatus: {
      count: 1,
      status: STATUS.RECALLED,
    },
    attentionMessages: ['テスト'],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.WORKDAY,
    recordDate: '2010-10-06',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: 0,
      endTime: 0,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.WORKDAY,
    recordDate: '2010-10-06',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.LEGAL_HOLIDAY,
    recordDate: '2010-10-07',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.HOLIDAY,
    recordDate: '2010-10-08',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.ALL_DAY_PAID_LEAVE,
    recordDate: '2010-10-09',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.ALL_DAY_UNPAID_LEAVE,
    recordDate: '2010-10-10',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.AM_PAID_LEAVE,
    recordDate: '2010-10-11',
    startTime: 60 * 14,
    endTime: null,
    contractedDetail: {
      startTime: 60 * 14,
      endTime: 60 * 19,
    },
    remarkableRequestStatus: null,
    attentionMessages: ['テスト'],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.PM_UNPAID_LEAVE,
    recordDate: '2010-10-12',
    startTime: 60 * 9,
    endTime: 60 * 14,
    contractedDetail: {
      startTime: 60 * 9,
      endTime: 60 * 14,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.AM_UNPAID_LEAVE_PM_PAID_LEAVE,
    recordDate: '2010-10-13',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: ['テスト'],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.ALL_DAY_UNPAID_LEAVE,
    recordDate: '2010-10-14',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: ['テスト'],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
  {
    rowType: ROW_TYPE.ALL_DAY_UNPAID_LEAVE,
    recordDate: '2010-10-15',
    startTime: null,
    endTime: null,
    contractedDetail: {
      startTime: null,
      endTime: null,
    },
    remarkableRequestStatus: null,
    attentionMessages: [],
    fixDailyRequest: {
      approver01Name: '',
      id: 'id',
      performableActionForFix: 'None',
      status: 'NotRequested',
    },
  },
];
