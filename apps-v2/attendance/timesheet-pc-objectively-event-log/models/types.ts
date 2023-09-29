export type ObjectivelyEventLogDailyRecord = {
  attRecord: {
    id: string | null | undefined;
    recordDate: string | null | undefined;
    inpStartTime: number | null | undefined;
    inpEndTime: number | null | undefined;
    attSummary: {
      id: string | null | undefined;
      workingType: {
        requireDeviationReason1: boolean | null | undefined;
        requireDeviationReason2: boolean | null | undefined;
        requireDeviationReason3: boolean | null | undefined;
        objectivelyEventLogSetting1: EventLogSettingObj | null | undefined;
        objectivelyEventLogSetting2: EventLogSettingObj | null | undefined;
        objectivelyEventLogSetting3: EventLogSettingObj | null | undefined;
        allowingDeviationTime1: number | null | undefined;
        allowingDeviationTime2: number | null | undefined;
        allowingDeviationTime3: number | null | undefined;
      };
    };
  };
  inLogList: InLogList[];
  outLogList: OutLogList[];
  id: string | null | undefined;
  deviatedEnteringFlag1: boolean | null | undefined;
  deviatedEnteringFlag2: boolean | null | undefined;
  deviatedEnteringFlag3: boolean | null | undefined;
  enteringEventLogSettingCode1: string | null | undefined;
  enteringEventLogSettingCode2: string | null | undefined;
  enteringEventLogSettingCode3: string | null | undefined;
  enteringTime1: number | null | undefined;
  enteringTime2: number | null | undefined;
  enteringTime3: number | null | undefined;
  deviatedEnteringTime1: number | null | undefined;
  deviatedEnteringTime2: number | null | undefined;
  deviatedEnteringTime3: number | null | undefined;
  deviatedEnteringTimeReason: string | null | undefined;
  deviatedEnteringTimeReasonSelectedLabel: string | null | undefined;
  deviatedLeavingFlag1: boolean | null | undefined;
  deviatedLeavingFlag2: boolean | null | undefined;
  deviatedLeavingFlag3: boolean | null | undefined;
  leavingEventLogSettingCode1: string | null | undefined;
  leavingEventLogSettingCode2: string | null | undefined;
  leavingEventLogSettingCode3: string | null | undefined;
  leavingTime1: number | null | undefined;
  leavingTime2: number | null | undefined;
  leavingTime3: number | null | undefined;
  enteringEventLogId1: string | null | undefined;
  leavingEventLogId1: string | null | undefined;
  enteringEventLogId2: string | null | undefined;
  leavingEventLogId2: string | null | undefined;
  enteringEventLogId3: string | null | undefined;
  leavingEventLogId3: string | null | undefined;
  deviatedLeavingTime1: number | null | undefined;
  deviatedLeavingTime2: number | null | undefined;
  deviatedLeavingTime3: number | null | undefined;
  deviatedLeavingTimeReason: string | null | undefined;
  deviatedLeavingTimeReasonSelectedLabel: string | null | undefined;
};

export type EventLogSettingObj = {
  id: string | null | undefined;
  code: string | null | undefined;
  name: string | null | undefined;
};

export type InLogList = {
  allowingDeviationTime: number | null | undefined;
  deviatedEnteringTime: number | null | undefined;
  enteringEventLogId: string | null | undefined;
  enteringEventLogSettingCode: string | null | undefined;
  enteringTime: number | null | undefined;
  requireDeviationReason: boolean | null | undefined;
  objectivelyEventLogSettingName: string | null | undefined;
  objectivelyEventLogSettingId: string | null | undefined;
};

export type OutLogList = {
  allowingDeviationTime: number | null | undefined;
  deviatedLeavingTime: number | null | undefined;
  leavingEventLogId: string | null | undefined;
  leavingEventLogSettingCode: string | null | undefined;
  leavingTime: number | null | undefined;
  requireDeviationReason: boolean | null | undefined;
  objectivelyEventLogSettingName: string | null | undefined;
  objectivelyEventLogSettingId: string | null | undefined;
};

export type ObjectivelyEventLogDailyRecordHeader = {
  yearMonthly: {
    yearMonthly: string | null | undefined;
    startDate: string | null | undefined;
    endDate: string | null | undefined;
  };
  employee: {
    name: string | null | undefined;
    id: string | null | undefined;
    code: string | null | undefined;
  };
  employeeInfoList: EmployeeInfoList[];
};

export type EmployeeInfoList = {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  department: {
    name: string | null | undefined;
    id: string | null | undefined;
    code: string | null | undefined;
  };
  workingType: {
    name: string | null | undefined;
    id: string | null | undefined;
    code: string | null | undefined;
  };
};

export type OwnerInfo = {
  startDate: string;
  endDate: string;
  employee: {
    name: string;
    code: string;
  };
  department: {
    name: string;
  };
  workingType: {
    name: string;
  };
};
