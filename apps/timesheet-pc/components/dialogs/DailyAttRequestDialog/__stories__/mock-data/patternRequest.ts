import { defaultValue } from '../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import {
  create,
  PatternRequest,
} from '../../../../../../domain/models/attendance/AttDailyRequest/PatternRequest';
import { CODE } from '../../../../../../domain/models/attendance/AttDailyRequestType';

export const attPatternList = [
  {
    name: 'pattern1',
    code: 'pattern1',
    startTime: 300,
    endTime: 1320,
    restTimes: [
      {
        startTime: 420,
        endTime: 480,
      },
      {
        startTime: 600,
        endTime: 660,
      },
      {
        startTime: 780,
        endTime: 900,
      },
      {
        startTime: 1020,
        endTime: 1080,
      },
      {
        startTime: 1200,
        endTime: 1260,
      },
    ],
  },
  {
    name: 'pattern2',
    code: 'pattern2',
    startTime: 600,
    endTime: 1140,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
      },
    ],
  },
];

export const selectedAttPattern = {
  name: 'pattern2',
  code: 'pattern2',
  startTime: 300,
  endTime: 1320,
  restTimes: [
    {
      startTime: 420,
      endTime: 480,
    },
    {
      startTime: 600,
      endTime: 660,
    },
    {
      startTime: 780,
      endTime: 900,
    },
    {
      startTime: 1020,
      endTime: 1080,
    },
    {
      startTime: 1200,
      endTime: 1260,
    },
  ],
};

export const defaultPatternRequest: PatternRequest = create({
  ...defaultValue,
  requestTypeCode: CODE.Pattern,
  startDate: '2018-06-18',
  endDate: '2018-06-19',
  startTime: 60 * 9,
  endTime: 60 * 19,
  reason: 'reason',
  approver01Name: 'Approver',
  isForReapply: false,
  patternCode: 'pattern1',
  patternName: 'pattern1',
});
