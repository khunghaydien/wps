import { ACTIONS_FOR_FIX } from '@apps/attendance/domain/models/AttFixSummaryRequest';
import { STATUS } from '@apps/attendance/domain/models/FixDailyRequest';

export const startTime = 9 * 60;
export const endTime = 18 * 60;
export const restTimes = [
  {
    id: '1',
    startTime: 12 * 60,
    endTime: 13 * 60,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  {
    id: '2',
    startTime: 18 * 60,
    endTime: 19 * 60,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
];
export const restHours = 5;

export const restReason = {
  id: 'a0A2800000FmMQCEA1',
  name: 'お昼休み',
  code: '001',
};

export const otherRestReason = {
  id: 'a0A2800000FmMQCEA1',
  name: 'お昼休み',
  code: '001',
};

export const commuteCount = {
  forwardCount: 1,
  backwardCount: 0,
};

export const remarks = 'REMARKS';

export const contractedDetail = {
  startTime: 9 * 60,
  endTime: 18 * 60,
  restTimes: [
    {
      startTime: 12 * 60,
      endTime: 13 * 60,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
  ],
};

export const hasOtherRestTime = true;

export const attentionMessages = [
  'SHORT_TEXT',
  'LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_LONG_TEXT_',
];

export const fixDailyRequest = {
  approver01Name: '',
  id: '',
  performableActionForFix: ACTIONS_FOR_FIX.None,
  status: STATUS.NOT_REQUESTED,
};
