/**
 * 注意喚起メッセージを生成するのに必要な情報を保持するモデルです。
 * 各画面で表示するメッセージが異なるため、ここでは各注意喚起のコードと値のみを生成しております。
 *
 * メッセージを BE で生成するのか FE で生成するのかが現在で揺れております。
 * また、元々、BE でメッセージを生成していたので、このようなメッセージ生成モデルの置き場所が決まっておりません。
 * 規制が整いましたら、このファイルを然るべき場所へ移動、もしくは修正、削除をお願いいたします。
 */
import {
  hasInsufficientRestTime,
  hasOutInsufficientMinimumWorkHours,
  isRealEndTimeOnEffectiveWorkingTime,
  isRealStartTimeOnEffectiveWorkingTime,
  isRealWorkingTimeOnEffectiveWorkingTime,
} from './AttDailyRecord';
import * as DailyObjectivelyEventLog from './DailyObjectivelyEventLog';

/**
 * 注意喚起するべき事柄の種別を示すコード
 */
export const CODE = {
  /**
   * 無効な実労働時間
   * 時間外勤務申請が必要な時間に、申請がないまま労働がある場合に発生する
   */
  INEFFECTIVE_WORKING_TIME: 'IneffectiveWorkingTime',

  /**
   * 不足休憩時間
   * 法定休憩時間に対して実際に取得した休憩時間が不足している場合に発生する
   */
  INSUFFICIENT_REST_TIME: 'InsufficientRestTime',

  /**
   * 客観ログ入退館乖離時間
   */
  OVER_ALLOWING_DEVIATION_TIME: 'OverAllowingDeviationTime',

  /**
   * 不足最低勤務時間
   */
  OUT_INSUFFICIENT_MINIMUM_WORK_HOURS: 'OutInsufficientMinimumWorkHours',
} as const;

type IneffectiveWorkingTime = {
  code: typeof CODE.INEFFECTIVE_WORKING_TIME;
  value: {
    fromTime: number;
    toTime: number;
  };
};

type InsufficientRestTime = {
  code: typeof CODE.INSUFFICIENT_REST_TIME;
  value: number;
};

type OverAllowingDeviationTime = {
  code: typeof CODE.OVER_ALLOWING_DEVIATION_TIME;
};

type OutInsufficientMinimumWorkHours = {
  code: typeof CODE.OUT_INSUFFICIENT_MINIMUM_WORK_HOURS;
  value: number;
};

export type AttDailyAttention =
  | IneffectiveWorkingTime
  | InsufficientRestTime
  | OverAllowingDeviationTime
  | OutInsufficientMinimumWorkHours;

const createIneffectiveWorkingTimeAttention = (
  fromTime: number,
  toTime: number
): IneffectiveWorkingTime => ({
  code: CODE.INEFFECTIVE_WORKING_TIME,
  value: {
    fromTime,
    toTime,
  },
});

const createInsufficientRestTime = (
  insufficientRestTime: number
): InsufficientRestTime => ({
  code: CODE.INSUFFICIENT_REST_TIME,
  value: insufficientRestTime,
});

const createOutInsufficientMinimumWorkHours = (
  outInsufficientMinimumWorkHours: number
): OutInsufficientMinimumWorkHours => ({
  code: CODE.OUT_INSUFFICIENT_MINIMUM_WORK_HOURS,
  value: outInsufficientMinimumWorkHours,
});

const createOverAllowingDeviationTime = (): OverAllowingDeviationTime => ({
  code: CODE.OVER_ALLOWING_DEVIATION_TIME,
});

/**
 * 任意の勤怠明細について、注意喚起するべき事柄を検出して、配列として返却する
 */
export function createAttDailyAttentions(record: {
  startTime: number | null;
  endTime: number | null;
  outStartTime: number | null;
  outEndTime: number | null;
  insufficientRestTime: number | null;
  outInsufficientMinimumWorkHours: number | null;
  objectivelyEventLog?: DailyObjectivelyEventLog.DailyObjectivelyEventLog;
}): AttDailyAttention[] {
  const attention = [];

  // 客観ログの乖離時間
  const result = DailyObjectivelyEventLog.getAttentionTypeAtDaily({
    startTime: record.startTime,
    endTime: record.endTime,
    dailyObjectivelyEventLog: record.objectivelyEventLog,
  });
  if (result === DailyObjectivelyEventLog.ATTENTION_TYPE.ERROR) {
    attention.push(createOverAllowingDeviationTime());
  }

  // 無効な実労働時間の検査
  if (!isRealWorkingTimeOnEffectiveWorkingTime(record)) {
    attention.push(
      createIneffectiveWorkingTimeAttention(
        record.startTime + 0,
        record.endTime + 0
      )
    );
  } else {
    if (!isRealStartTimeOnEffectiveWorkingTime(record)) {
      attention.push(
        createIneffectiveWorkingTimeAttention(
          record.startTime + 0,
          record.outStartTime + 0
        )
      );
    }
    if (!isRealEndTimeOnEffectiveWorkingTime(record)) {
      attention.push(
        createIneffectiveWorkingTimeAttention(
          record.outEndTime + 0,
          record.endTime + 0
        )
      );
    }
  }

  // 不足休憩時間の検査
  if (hasInsufficientRestTime(record)) {
    attention.push(createInsufficientRestTime(record.insufficientRestTime + 0));
  }

  // 不足最低勤務時間の検査
  if (hasOutInsufficientMinimumWorkHours(record)) {
    attention.push(
      createOutInsufficientMinimumWorkHours(
        record.outInsufficientMinimumWorkHours + 0
      )
    );
  }

  return attention;
}
