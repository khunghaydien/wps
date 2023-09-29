import { DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel } from '@attendance/domain/models/DailyActualWorkingTimePeriod';

const dailyActualWorkingPeriodListMap: {
  [date: string]: DailyActualWorkingTimePeriodModel[];
} = {
  '2020-02-01': null,
  '2020-02-02': [
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 720,
    },
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 780,
      endTime: 1080,
    },
  ],
  '2020-02-03': [
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 720,
    },
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 780,
      endTime: 1080,
    },
  ],
  '2020-02-04': null,
  '2020-02-05': [
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 840,
      endTime: 900,
    },
  ],
  '2020-02-06': null,
  '2020-02-07': [
    {
      type: 'CONTRACT_OUT_LEGAL_OUT',
      startTime: 120,
      endTime: 540,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 720,
    },
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 780,
      endTime: 1080,
    },
    {
      type: 'CONTRACT_OUT_LEGAL_OUT',
      startTime: 1080,
      endTime: 1200,
    },
  ],
  '2020-02-08': null,
  '2020-02-09': null,
  '2020-02-10': [
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 966,
      endTime: 1080,
    },
  ],
  '2020-02-11': null,
  '2020-02-12': [
    {
      type: 'CONTRACT_OUT_LEGAL_OUT',
      startTime: 240,
      endTime: 540,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 1020,
    },
    {
      type: 'CONTRACT_OUT_LEGAL_OUT',
      startTime: 1020,
      endTime: 1200,
    },
  ],
  '2020-02-13': [
    {
      type: 'CONTRACT_OUT_LEGAL_IN',
      startTime: 240,
      endTime: 540,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 674,
    },
  ],
  '2020-02-14': null,
  '2020-02-15': null,
  '2020-02-16': null,
  '2020-02-17': [
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 720,
    },
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 780,
      endTime: 1080,
    },
  ],
  '2020-02-18': [
    {
      type: 'CONTRACT_OUT_LEGAL_OUT',
      startTime: 480,
      endTime: 540,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 720,
    },
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 780,
      endTime: 1080,
    },
    {
      type: 'CONTRACT_OUT_LEGAL_OUT',
      startTime: 1080,
      endTime: 1200,
    },
  ],
  '2020-02-19': [
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 540,
      endTime: 720,
    },
    {
      type: 'REST',
      startTime: 720,
      endTime: 780,
    },
    {
      type: 'CONTRACT_IN_LEGAL_IN',
      startTime: 780,
      endTime: 960,
    },
  ],
  '2020-02-20': null,
  '2020-02-21': null,
  '2020-02-22': null,
  '2020-02-23': null,
  '2020-02-24': null,
  '2020-02-25': null,
  '2020-02-26': null,
  '2020-02-27': null,
  '2020-02-28': null,
  '2020-02-29': null,
};

export default dailyActualWorkingPeriodListMap;
