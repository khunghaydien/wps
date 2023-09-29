import { AllowanceRecord } from '../../../models/types';

export default [
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
] as AllowanceRecord[];
