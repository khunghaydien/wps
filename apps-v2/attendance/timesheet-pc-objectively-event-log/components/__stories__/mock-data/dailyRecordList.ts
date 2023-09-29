import { ObjectivelyEventLogDailyRecord } from '../../../models/types';

export default [
  {
    attRecord: {
      recordDate: '2022-02-01',
      inpStartTime: 540,
      inpEndTime: 920,
    },
    inLogList: [
      {
        allowingDeviationTime: 10,
        deviatedEnteringTime: 20,
        enteringTime: 560,
        objectivelyEventLogSettingName: 'Door',
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
    ],
    outLogList: [
      {
        allowingDeviationTime: 10,
        deviatedLeavingTime: 40,
        leavingTime: 880,
        objectivelyEventLogSettingName: 'Door',
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
    ],
  },
  {
    attRecord: {
      recordDate: '2022-02-02',
      inpStartTime: 540,
      inpEndTime: 920,
    },
    inLogList: [
      {
        allowingDeviationTime: 50,
        deviatedEnteringTime: 20,
        enteringTime: 560,
        objectivelyEventLogSettingName: 'Door',
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
    ],
    outLogList: [
      {
        allowingDeviationTime: 50,
        deviatedLeavingTime: 40,
        leavingTime: 880,
        objectivelyEventLogSettingName: 'Door',
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
      {
        allowingDeviationTime: null,
        deviatedEnteringTime: null,
        enteringTime: null,
        objectivelyEventLogSettingName: null,
      },
    ],
  },
] as ObjectivelyEventLogDailyRecord[];
