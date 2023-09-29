export interface DeviationReason {
  label: string;
  value: string;
}

export interface DailyObjectivelyEventLogDeviationReasons {
  id: string;
  deviationReasons: Map<DeviationReason['value'], DeviationReason>;
}

export interface IDailyObjectivelyEventLogDeviationReasonRepository {
  fetchList: (parameters: {
    employeeId?: string;
    targetDate: string;
  }) => Promise<DailyObjectivelyEventLogDeviationReasons>;
}
