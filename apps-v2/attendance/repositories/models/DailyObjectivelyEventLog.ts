import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { EVENT_TYPE } from '@attendance/domain/models/ObjectivelyEventLogRecord';

export type ObjectivelyEventLogSetting = {
  id: string;
  code: string;
  name: string;
};

export type AttRecord = {
  id: string;
  recordDate: string;
  inpStartTime: number | null;
  inpEndTime: number | null;
  attSummary: {
    id: string;
    workingType: {
      objectivelyEventLogSetting1: ObjectivelyEventLogSetting | null;
      allowingDeviationTime1: number | null;
      requireDeviationReason1: boolean;
      objectivelyEventLogSetting2: ObjectivelyEventLogSetting | null;
      allowingDeviationTime2: number | null;
      requireDeviationReason2: boolean;
      objectivelyEventLogSetting3: ObjectivelyEventLogSetting | null;
      allowingDeviationTime3: number | null;
      requireDeviationReason3: boolean;
    };
  };
};

export type DailyObjectivelyEventLogRecord = {
  id: string;
  deviationReasonExtendedItemId: string;
  deviatedEnteringTimeReasonSelectedValue: string;
  deviatedEnteringTimeReasonSelectedLabel: string;
  deviatedLeavingTimeReasonSelectedValue: string;
  deviatedLeavingTimeReasonSelectedLabel: string;
  deviatedEnteringTimeReason: string;
  deviatedLeavingTimeReason: string;
  enteringEventLogId1: string;
  leavingEventLogId1: string;
  enteringTime1: number;
  leavingTime1: number;
  enteringEventLogUpdated1By: string;
  leavingEventLogUpdated1By: string;
  deviatedEnteringTime1: number;
  deviatedLeavingTime1: number;
  enteringEventLogId2: string;
  leavingEventLogId2: string;
  enteringTime2: number;
  leavingTime2: number;
  enteringEventLogUpdated2By: string;
  leavingEventLogUpdated2By: string;
  deviatedEnteringTime2: number;
  deviatedLeavingTime2: number;
  enteringEventLogId3: string;
  leavingEventLogId3: string;
  enteringTime3: number;
  leavingTime3: number;
  enteringEventLogUpdated3By: string;
  leavingEventLogUpdated3By: string;
  deviatedEnteringTime3: number;
  deviatedLeavingTime3: number;
  attRecord: AttRecord;
};

const convertRecord = (
  record: DailyObjectivelyEventLogRecord
): DailyObjectivelyEventLog => {
  const logs: DailyObjectivelyEventLog['logs'] = [
    record.attRecord.attSummary.workingType.objectivelyEventLogSetting1
      ? {
          setting: {
            id: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting1.id,
            name: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting1.name,
            code: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting1.code,
          },
          entering: {
            id: record.enteringEventLogId1,
            eventType: EVENT_TYPE.ENTERING,
            time: record.enteringTime1,
            eventLogUpdatedBy: record.enteringEventLogUpdated1By,
            deviatedTime: record.deviatedEnteringTime1,
            linked: '',
          },
          leaving: {
            id: record.leavingEventLogId1,
            eventType: EVENT_TYPE.LEAVING,
            time: record.leavingTime1,
            eventLogUpdatedBy: record.leavingEventLogUpdated1By,
            deviatedTime: record.deviatedLeavingTime1,
            linked: '',
          },
          requireDeviationReason:
            record.attRecord.attSummary.workingType.requireDeviationReason1,
          allowingDeviationTime:
            record.attRecord.attSummary.workingType.allowingDeviationTime1,
        }
      : null,
    record.attRecord.attSummary.workingType.objectivelyEventLogSetting2
      ? {
          setting: {
            id: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting2.id,
            name: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting2.name,
            code: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting2.code,
          },
          entering: {
            id: record.enteringEventLogId2,
            eventType: EVENT_TYPE.ENTERING,
            time: record.enteringTime2,
            eventLogUpdatedBy: record.enteringEventLogUpdated2By,
            deviatedTime: record.deviatedEnteringTime2,
            linked: '',
          },
          leaving: {
            id: record.leavingEventLogId2,
            eventType: EVENT_TYPE.LEAVING,
            time: record.leavingTime2,
            eventLogUpdatedBy: record.leavingEventLogUpdated2By,
            deviatedTime: record.deviatedLeavingTime2,
            linked: '',
          },
          requireDeviationReason:
            record.attRecord.attSummary.workingType.requireDeviationReason2,
          allowingDeviationTime:
            record.attRecord.attSummary.workingType.allowingDeviationTime2,
        }
      : null,
    record.attRecord.attSummary.workingType.objectivelyEventLogSetting3
      ? {
          setting: {
            id: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting3.id,
            name: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting3.name,
            code: record.attRecord.attSummary.workingType
              .objectivelyEventLogSetting3.code,
          },
          entering: {
            id: record.enteringEventLogId3,
            eventType: EVENT_TYPE.ENTERING,
            time: record.enteringTime3,
            eventLogUpdatedBy: record.enteringEventLogUpdated3By,
            deviatedTime: record.deviatedEnteringTime3,
            linked: '',
          },
          leaving: {
            id: record.leavingEventLogId3,
            eventType: EVENT_TYPE.LEAVING,
            time: record.leavingTime3,
            eventLogUpdatedBy: record.leavingEventLogUpdated3By,
            deviatedTime: record.deviatedLeavingTime3,
            linked: '',
          },
          requireDeviationReason:
            record.attRecord.attSummary.workingType.requireDeviationReason3,
          allowingDeviationTime:
            record.attRecord.attSummary.workingType.allowingDeviationTime3,
        }
      : null,
  ];

  return {
    id: record.id,
    recordId: record.attRecord.id,
    recordDate: record.attRecord.recordDate,
    inpStartTime: record.attRecord.inpStartTime,
    inpEndTime: record.attRecord.inpEndTime,
    deviationReasonExtendedItemId: record.deviationReasonExtendedItemId,
    deviatedEnteringTimeReason: {
      label: record.deviatedEnteringTimeReasonSelectedLabel,
      value: record.deviatedEnteringTimeReasonSelectedValue,
      text: record.deviatedEnteringTimeReason,
    },
    deviatedLeavingTimeReason: {
      label: record.deviatedLeavingTimeReasonSelectedLabel,
      value: record.deviatedLeavingTimeReasonSelectedValue,
      text: record.deviatedLeavingTimeReason,
    },
    logs,
  };
};

export const convert = (
  dailyRecordList: DailyObjectivelyEventLogRecord[]
): DailyObjectivelyEventLog[] =>
  dailyRecordList ? dailyRecordList.map(convertRecord) : null;
