import STATUS from '../../../../../domain/models/approval/request/Status';

import { ROW_TYPE } from '../../../../modules/attendance/timesheet/entities';

// eslint-disable-next-line import/prefer-default-export
export const items = [
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
      status: STATUS.ApprovalIn,
    },
    attentionMessages: ['テスト'],
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
      status: STATUS.Approved,
    },
    attentionMessages: ['テスト'],
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
      status: STATUS.Canceled,
    },
    attentionMessages: [],
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
      status: STATUS.Rejected,
    },
    attentionMessages: [],
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
      status: STATUS.Recalled,
    },
    attentionMessages: ['テスト'],
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
    attentionMessages: [],
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
    attentionMessages: [],
  },
  {
    rowType: ROW_TYPE.LEGAL_HOLIDAY,
    recordDate: '2010-10-07',
    contractedDetail: {},
    attentionMessages: [],
  },
  {
    rowType: ROW_TYPE.HOLIDAY,
    recordDate: '2010-10-08',
    contractedDetail: {},
    attentionMessages: [],
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
    attentionMessages: [],
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
    attentionMessages: [],
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
    attentionMessages: ['テスト'],
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
    attentionMessages: [],
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
    attentionMessages: ['テスト'],
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
    attentionMessages: ['テスト'],
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
    attentionMessages: [],
  },
];
