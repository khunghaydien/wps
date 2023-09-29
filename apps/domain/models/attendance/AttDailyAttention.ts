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
  isRealEndTimeOnEffectiveWorkingTime,
  isRealStartTimeOnEffectiveWorkingTime,
  isRealWorkingTimeOnEffectiveWorkingTime,
} from './AttDailyRecord';

/**
 * 注意喚起するべき事柄の種別を示すコード
 */
export const CODE = {
  /**
   * 無効な実労働時間
   * 時間外勤務申請が必要な時間に、申請がないまま労働がある場合に発生する
   */
  IneffectiveWorkingTime: 'IneffectiveWorkingTime',

  /**
   * 不足休憩時間
   * 法定休憩時間に対して実際に取得した休憩時間が不足している場合に発生する
   */
  InsufficientRestTime: 'InsufficientRestTime',
} as const;

type IneffectiveWorkingTime = {
  code: typeof CODE.IneffectiveWorkingTime;
  value: {
    fromTime: number;
    toTime: number;
  };
};

type InsufficientRestTime = {
  code: typeof CODE.InsufficientRestTime;
  value: number;
};

export type AttDailyAttention = IneffectiveWorkingTime | InsufficientRestTime;

const createIneffectiveWorkingTimeAttention = (
  fromTime: number,
  toTime: number
): IneffectiveWorkingTime => ({
  code: CODE.IneffectiveWorkingTime,
  value: {
    fromTime,
    toTime,
  },
});

const createInsufficientRestTime = (
  insufficientRestTime: number
): InsufficientRestTime => ({
  code: CODE.InsufficientRestTime,
  value: insufficientRestTime,
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
}): AttDailyAttention[] {
  const attention = [];

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

  return attention;
}
