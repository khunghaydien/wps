import { DailyObjectivelyEventLog } from '../../DailyObjectivelyEventLog';
import { EVENT_TYPE } from '../../ObjectivelyEventLogRecord';

export const defaultValue: DailyObjectivelyEventLog = {
  id: 'dailyObjectivelyEventLogId',
  recordId: 'recordId_0001',
  recordDate: '2020-01-01',
  inpStartTime: 6 * 60 + 55,
  inpEndTime: 17 * 60 + 55,
  deviationReasonExtendedItemId: null,
  deviatedEnteringTimeReason: {
    label: null,
    value: '100',
    text: 'Deviated Entering Time Reason',
  },
  deviatedLeavingTimeReason: {
    label: null,
    value: '200',
    text: 'Deviated Leaving Time Reason',
  },
  logs: [
    {
      setting: {
        id: 'id1',
        name: 'LONG LONG NAME LONG LONG NAME LONG LONG NAME LONG LONG NAME LONG LONG NAME LONG LONG NAME LONG LONG NAME LONG LONG NAME LONG LONG NAME',
        code: 'DAILY_OBJECTIVELY_EVENT_LOG_1',
      },
      entering: {
        id: '00001',
        eventType: EVENT_TYPE.ENTERING,
        time: 7 * 60 + 5,
        eventLogUpdatedBy: 'Log1 Event Log Updated By',
        deviatedTime: 5,
        linked: '',
      },
      leaving: {
        id: '00002',
        eventType: EVENT_TYPE.LEAVING,
        time: 16 * 60 + 6,
        eventLogUpdatedBy: '',
        deviatedTime: 6,
        linked: '',
      },
      allowingDeviationTime: null,
      requireDeviationReason: false,
    },
    {
      setting: {
        id: 'id2',
        name: 'log2',
        code: 'DAILY_OBJECTIVELY_EVENT_LOG_2',
      },
      entering: {
        id: '00003',
        eventType: EVENT_TYPE.ENTERING,
        time: 7 * 60 - 6,
        eventLogUpdatedBy: 'Log2 Event Log Updated By',
        deviatedTime: 6,
        linked: '',
      },
      leaving: {
        id: '00004',
        eventType: EVENT_TYPE.LEAVING,
        time: 16 * 60 - 5,
        eventLogUpdatedBy: '',
        deviatedTime: 5,
        linked: '',
      },
      allowingDeviationTime: 5,
      requireDeviationReason: false,
    },
    {
      setting: {
        id: 'id3',
        name: 'log3',
        code: 'DAILY_OBJECTIVELY_EVENT_LOG_3',
      },
      entering: {
        id: '00005',
        eventType: EVENT_TYPE.ENTERING,
        time: 9 * 60,
        eventLogUpdatedBy: 'Log3 Event Log Updated By',
        deviatedTime: 60 * 2,
        linked: '',
      },
      leaving: {
        id: '00006',
        eventType: EVENT_TYPE.LEAVING,
        time: 18 * 60,
        eventLogUpdatedBy: '',
        deviatedTime: 60 * 2,
        linked: '',
      },
      allowingDeviationTime: 30,
      requireDeviationReason: true,
    },
  ],
};
