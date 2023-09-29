import { DailyObjectivelyEventLogRecord } from '../../DailyObjectivelyEventLog';

export const defaultValue: DailyObjectivelyEventLogRecord[] = [
  {
    attRecord: {
      id: 'recordId',
      recordDate: '2020-01-01',
      inpStartTime: 415,
      inpEndTime: 1075,
      attSummary: {
        id: 'attSummaryId',
        workingType: {
          objectivelyEventLogSetting1: {
            id: 'setting1',
            name: 'name1',
            code: 'CODE_NAME_1',
          },
          allowingDeviationTime1: null,
          requireDeviationReason1: false,
          objectivelyEventLogSetting2: {
            id: 'setting2',
            name: 'name2',
            code: 'CODE_NAME_2',
          },
          allowingDeviationTime2: 5,
          requireDeviationReason2: false,
          objectivelyEventLogSetting3: {
            id: 'setting3',
            name: 'name3',
            code: 'CODE_NAME_3',
          },
          allowingDeviationTime3: 60,
          requireDeviationReason3: true,
        },
      },
    },
    id: 'dailyObjectivelyEventLogId',
    deviatedEnteringTimeReason: 'Deviated Entering Time Reason',
    deviatedLeavingTimeReason: 'Deviated Leaving Time Reason',
    deviationReasonExtendedItemId: 'deviationReasonExtendedItemId',
    deviatedEnteringTimeReasonSelectedValue:
      'deviatedEnteringTimeReasonSelectedValue',
    deviatedEnteringTimeReasonSelectedLabel:
      'deviatedEnteringTimeReasonSelectedLabel',
    deviatedLeavingTimeReasonSelectedValue:
      'deviatedLeavingTimeReasonSelectedValue',
    deviatedLeavingTimeReasonSelectedLabel:
      'deviatedLeavingTimeReasonSelectedLabel',
    enteringEventLogId1: 'enteringEventLogId1',
    leavingEventLogId1: 'leavingEventLogId1',
    enteringTime1: 480,
    leavingTime1: 1020,
    enteringEventLogUpdated1By: 'Entering event log updated1 by',
    leavingEventLogUpdated1By: 'Leaving event log updated1 by',
    deviatedEnteringTime1: 5,
    deviatedLeavingTime1: 6,
    enteringEventLogId2: 'enteringEventLogId2',
    leavingEventLogId2: 'leavingEventLogId2',
    enteringTime2: 470,
    leavingTime2: 1011,
    enteringEventLogUpdated2By: 'Entering event log updated2 by',
    leavingEventLogUpdated2By: 'Leaving event log updated2 by',
    deviatedEnteringTime2: 10,
    deviatedLeavingTime2: 9,
    enteringEventLogId3: 'enteringEventLogId3',
    leavingEventLogId3: 'leavingEventLogId3',
    enteringTime3: 481,
    leavingTime3: 1023,
    enteringEventLogUpdated3By: 'Entering event log updated3 by',
    leavingEventLogUpdated3By: 'Leaving event log updated3 by',
    deviatedEnteringTime3: 1,
    deviatedLeavingTime3: 3,
  },
];
