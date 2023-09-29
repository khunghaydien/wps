import { AllowanceDailyRecord } from '../../../models/types';

export default [
  {
    recordDate: '2021-12-01',
    dailyAllowanceList: [
      {
        allowanceName: '高所作業',
        allowanceCode: 'AAA',
        managementType: 'StartEndTime',
        order: 1,
        startTime: 540,
        endTime: 600,
        totalTime: 60,
        quantity: null,
      },
      {
        allowanceName: '高温作業',
        allowanceCode: 'BBB',
        managementType: 'Hours',
        order: 2,
        startTime: null,
        endTime: null,
        totalTime: 60,
        quantity: null,
      },
      {
        allowanceName: 'ご飯手当',
        allowanceCode: '003',
        managementType: 'Quantity',
        order: 3,
        startTime: null,
        endTime: null,
        totalTime: null,
        quantity: 999999.999999,
      },
      {
        allowanceName: '特別手当',
        allowanceCode: '004',
        managementType: 'None',
        order: 1,
        startTime: null,
        endTime: null,
        totalTime: null,
        quantity: null,
      },
    ],
  },
  {
    recordDate: '2021-12-02',
    dailyAllowanceList: [],
  },
  {
    recordDate: '2021-12-03',
    dailyAllowanceList: [
      {
        allowanceName: '取材手当',
        allowanceCode: 'CCC',
        managementType: 'Quantity',
        order: 1,
        startTime: null,
        endTime: null,
        totalTime: null,
        quantity: 23,
      },
    ],
  },
] as AllowanceDailyRecord[];
