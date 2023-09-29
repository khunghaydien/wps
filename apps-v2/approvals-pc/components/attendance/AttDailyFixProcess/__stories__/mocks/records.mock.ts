import * as React from 'react';

import sampleEmployeeIcon from '@apps/commons/images/Sample_photo001.png';

import { CODE as DAILY_ATTENTION_CODE } from '@attendance/domain/models/AttDailyAttention';

import Component from '../../List/Content';
import { time } from '@attendance/__tests__/helpers';

type Records = React.ComponentProps<typeof Component>['requests'];

export const defaultValue = [
  {
    id: '0001',
    submitter: {
      employee: {
        code: 'EMP-0001',
        name: 'Employee Name',
        photoUrl: sampleEmployeeIcon,
        department: {
          name: 'Department',
        },
      },
    },
    targetDate: '2022/02/22',
    targetRecord: {
      recordDate: '2022/02/22',
      startTime: time(7, 0),
      endTime: time(16, 0),
      realWorkTime: time(9, 0),
      overTime: time(0, 0),
      event: 'Early Start Work, Direct',
      attentions: [
        {
          code: DAILY_ATTENTION_CODE.INEFFECTIVE_WORKING_TIME,
          value: {
            fromTime: time(7),
            toTime: time(9),
          },
        },
      ],
    },
    records: [],
    recordTotal: {
      overTime: time(22, 22),
    },
    attention: {
      ineffectiveWorkingTime: 1,
      insufficientRestTime: 1,
    },
  },
  {
    id: '0002',
    submitter: {
      employee: {
        code: 'EMP-0001',
        name: 'Employee Name',
        photoUrl: sampleEmployeeIcon,
        department: {
          name: 'Department',
        },
      },
    },
    targetDate: '2022/02/22',
    targetRecord: {
      recordDate: '2022/02/22',
      startTime: time(7, 0),
      endTime: time(16, 0),
      realWorkTime: time(9, 0),
      overTime: time(0, 0),
      event: 'Early Start Work, Direct',
      attentions: [
        {
          code: DAILY_ATTENTION_CODE.INEFFECTIVE_WORKING_TIME,
          value: {
            fromTime: time(7),
            toTime: time(9),
          },
        },
        {
          code: DAILY_ATTENTION_CODE.INEFFECTIVE_WORKING_TIME,
          value: {
            fromTime: time(18),
            toTime: time(22),
          },
        },
      ],
    },
    records: [],
    recordTotal: {
      overTime: time(22, 22),
    },
    attention: {
      ineffectiveWorkingTime: 0,
      insufficientRestTime: 0,
    },
  },
  {
    id: '0003',
    submitter: {
      employee: {
        code: 'EMP-0001',
        name: 'Employee Name',
        photoUrl: sampleEmployeeIcon,
        department: {
          name: 'Department',
        },
      },
    },
    targetDate: '2022/02/22',
    targetRecord: {
      recordDate: '2022/02/22',
      startTime: time(7, 0),
      endTime: time(16, 0),
      realWorkTime: time(9, 0),
      overTime: time(0, 0),
      event: 'Early Start Work, Direct',
    },
    records: [],
    recordTotal: {
      overTime: time(22, 22),
    },
    attention: {
      ineffectiveWorkingTime: 0,
      insufficientRestTime: 0,
    },
  },
  {
    id: '0004',
    submitter: {
      employee: {
        code: 'EMP-0001-LONG-LONG-LONG-LONG-LONG-LONG-LONG-LONG-LONG-LONG-LONG-LONG-LONG',
        name: 'Employee Name Employee Name Employee Name Employee Name Employee Name Employee Name',
        photoUrl: sampleEmployeeIcon,
        department: {
          name: 'Department Department Department Department Department Department Department',
        },
      },
    },
    targetDate: '2022/02/22',
    targetRecord: {
      recordDate: '2022/02/22',
      startTime: time(7),
      endTime: time(16),
      realWorkTime: time(9),
      overTime: 0,
      event:
        'Early Start Work, Direct, Long, Long, Long, Long, Long, Long, Long,',
    },
    records: [],
    recordTotal: {
      overTime: time(22, 22),
    },
    attention: {
      ineffectiveWorkingTime: 0,
      insufficientRestTime: 0,
    },
  },
] as unknown as Records;
