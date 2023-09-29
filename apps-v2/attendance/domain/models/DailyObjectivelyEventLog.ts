import {
  EVENT_TYPE,
  ObjectivelyEventLogRecord as $ObjectivelyEventLogRecord,
} from './ObjectivelyEventLogRecord';
import { ObjectivelyEventLogSetting } from './ObjectivelyEventLogSetting';

export const ATTENTION_TYPE = {
  NONE: 'none',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export type AttentionType = Value<typeof ATTENTION_TYPE>;

export type ObjectivelyEventLogRecord = $ObjectivelyEventLogRecord & {
  eventLogUpdatedBy: string;
  deviatedTime: number | null;
};

export type { ObjectivelyEventLogSetting };

export type Log = {
  setting: ObjectivelyEventLogSetting;
  entering: ObjectivelyEventLogRecord & {
    eventType: typeof EVENT_TYPE.ENTERING;
  };
  leaving: ObjectivelyEventLogRecord & {
    eventType: typeof EVENT_TYPE.LEAVING;
  };
  allowingDeviationTime: number | null;
  requireDeviationReason: boolean;
};

export type DeviationReason = {
  label: string;
  value: string;
  text: string;
};

export type DailyObjectivelyEventLog = {
  id: string;
  recordId: string;
  recordDate: string;
  inpStartTime: number | null;
  inpEndTime: number | null;
  deviationReasonExtendedItemId: string;
  deviatedEnteringTimeReason: DeviationReason;
  deviatedLeavingTimeReason: DeviationReason;
  logs: [Log | null, Log | null, Log | null];
};

export type IDailyObjectivelyEventLogRepository = {
  search: (parameters: {
    employeeId?: string;
    startDate: string;
    endDate: string;
  }) => Promise<DailyObjectivelyEventLog[]>;
  saveDeviationReason: (parameters: {
    id: string;
    deviatedEnteringTimeReason: DeviationReason;
    deviatedLeavingTimeReason: DeviationReason;
    deviationReasonExtendedItemId: string;
  }) => Promise<void>;
  setToBeApplied: (parameters: {
    id: DailyObjectivelyEventLog['id'];
    records: {
      enteringId: string;
      leavingId: string;
    }[];
  }) => Promise<void>;
};

/**
 * 乖離があるかの判定をする
 *
 * 乖離があれば `true` 、なければ `false` を返す。
 * [判定]
 * - 乖離判定なし : false
 * - 連携データなし:
 *     - 入力あり : true
 *     - 入力なし : false
 * - 連携データあり
 *     - 入力なし : true
 *     - 入力あり :
 *         - 許容時間超過 : true
 *         - 許容時間以内 : false
 */
export const isOverAllowingDeviationTime = (
  inputTime: number | null,
  record: ObjectivelyEventLogRecord | null,
  allowingDeviationTime: number | null
): boolean => {
  // 乖離判定なし
  if (allowingDeviationTime === null) {
    return false;
  }
  const { time } = record;
  // 連携データなし
  if (time === null) {
    return inputTime !== null;
  }
  // 連携データあり 入力なし
  if (inputTime === null) {
    return true;
  }
  // 連携データあり 入力あり
  return allowingDeviationTime < Math.abs(inputTime - time);
};

export const getAttentionType = ({
  inputTime,
  record,
  allowingDeviationTime,
  requireDeviationReason,
  reason,
}: {
  inputTime: number | null;
  record: ObjectivelyEventLogRecord | null;
  allowingDeviationTime: number | null;
  requireDeviationReason: boolean;
  reason?: string | null;
}): AttentionType => {
  const over = isOverAllowingDeviationTime(
    inputTime,
    record,
    allowingDeviationTime
  );
  if (over) {
    // 乖離時間がある場合
    if (reason) {
      // 理由がある場合
      return ATTENTION_TYPE.NONE;
    } else {
      if (requireDeviationReason) {
        // 理由が必須場合
        return ATTENTION_TYPE.ERROR;
      } else {
        // 理由が必須ではない場合
        return ATTENTION_TYPE.WARNING;
      }
    }
  } else {
    // 乖離時間がない場合
    return ATTENTION_TYPE.NONE;
  }
};

export const getAttentionTypeAtDaily = ({
  startTime,
  endTime,
  dailyObjectivelyEventLog,
}: {
  startTime: number | null;
  endTime: number | null;
  dailyObjectivelyEventLog: DailyObjectivelyEventLog;
}): AttentionType => {
  if (!dailyObjectivelyEventLog) {
    return ATTENTION_TYPE.NONE;
  }
  let type: AttentionType = ATTENTION_TYPE.NONE;
  for (const log of dailyObjectivelyEventLog.logs) {
    if (log === null) {
      continue;
    }

    const entering = getAttentionType({
      inputTime: startTime,
      record: log.entering,
      allowingDeviationTime: log.allowingDeviationTime,
      requireDeviationReason: log.requireDeviationReason,
      reason: !dailyObjectivelyEventLog.deviatedEnteringTimeReason?.text
        ? dailyObjectivelyEventLog.deviatedEnteringTimeReason?.value
        : dailyObjectivelyEventLog.deviatedEnteringTimeReason?.text,
    });
    const leaving = getAttentionType({
      inputTime: endTime,
      record: log.leaving,
      allowingDeviationTime: log.allowingDeviationTime,
      requireDeviationReason: log.requireDeviationReason,
      reason: !dailyObjectivelyEventLog.deviatedLeavingTimeReason?.text
        ? dailyObjectivelyEventLog.deviatedLeavingTimeReason?.value
        : dailyObjectivelyEventLog.deviatedLeavingTimeReason?.text,
    });

    if (entering === ATTENTION_TYPE.ERROR || leaving === ATTENTION_TYPE.ERROR) {
      type = ATTENTION_TYPE.ERROR;
      break;
    }

    if (
      entering === ATTENTION_TYPE.WARNING ||
      leaving === ATTENTION_TYPE.WARNING
    ) {
      type = ATTENTION_TYPE.WARNING;
    }
  }

  return type;
};
