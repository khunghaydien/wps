/**
 * [Value Object] 実労働時間帯
 * - AttRecordの抜粋
 */

/**
 * 労働時間の種別
 * @type {Object<String, String>}
 */
export const ACTUAL_WORKING_PERIOD_TYPE = {
  REST: 'REST',
  CONTRACT_IN_LEGAL_IN: 'CONTRACT_IN_LEGAL_IN',
  CONTRACT_IN_LEGAL_OUT: 'CONTRACT_IN_LEGAL_OUT',
  CONTRACT_OUT_LEGAL_IN: 'CONTRACT_OUT_LEGAL_IN',
  CONTRACT_OUT_LEGAL_OUT: 'CONTRACT_OUT_LEGAL_OUT',
} as const;

export type ActualWorkingPeriodType =
  typeof ACTUAL_WORKING_PERIOD_TYPE[keyof typeof ACTUAL_WORKING_PERIOD_TYPE];

export type DailyActualWorkingTimePeriod = {
  /**
   * 種別
   */
  type: ActualWorkingPeriodType;

  /**
   * 開始時刻（その日の0:00を0とした分で表す時刻）
   */
  startTime: number;

  /**
   * 終了時刻（その日の0:00を0とした分で表す時刻）
   */
  endTime: number;
};

/**
 * 日次勤怠明細から実労働時間に関する情報を抽出・加工して、返却する
 * 以下を、開始時刻でソートしたもの
 * - 所定内・法定内の実労働時間を表す開始時刻と終了時間のペア
 * - 所定内・法定外の実労働時間を表す開始時刻と終了時間のペア
 * - 所定外・法定内の実労働時間を表す開始時刻と終了時間のペア
 * - 所定外・法定外の実労働時間を表す開始時刻と終了時間のペア
 * - 休憩時間を表す開始時刻と終了時間のペア
 * @param {AttRecord} attRecord
 * @return {Array.<DailyActualWorkingTimePeriod>} 勤怠明細が実労働時間を表現することができない状態であれば、nullを返却する
 */
export const buildDailyActualWorkingPeriodListFromAttRecord = (
  attRecord
): DailyActualWorkingTimePeriod[] => {
  const dailyActualWorkingPeriodList: DailyActualWorkingTimePeriod[] = [];

  // 勤怠明細が実労働時間を表現することができない状態であれば、nullを返却する
  if (!attRecord.isActualWorkingTimeRepresentable) {
    return null;
  }

  // 実労働時間：勤怠計算の結果
  [
    ['ciliTimePeriods', ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_IN],
    ['ciloTimePeriods', ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_OUT],
    ['coliTimePeriods', ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_IN],
    ['coloTimePeriods', ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_OUT],
  ].forEach(([key, type]) => {
    attRecord[key].forEach((period) =>
      dailyActualWorkingPeriodList.push({
        ...period,
        type,
      })
    );
  });

  // 休憩時間
  for (let i = 1; i <= 5; i++) {
    const startTime =
      attRecord[`rest${i}StartTime`] === 0
        ? attRecord[`rest${i}StartTime`]
        : attRecord[`rest${i}StartTime`] || null;

    const endTime =
      attRecord[`rest${i}EndTime`] === 0
        ? attRecord[`rest${i}EndTime`]
        : attRecord[`rest${i}EndTime`] || null;

    if (startTime !== null && endTime !== null) {
      dailyActualWorkingPeriodList.push({
        startTime,
        endTime,
        type: ACTUAL_WORKING_PERIOD_TYPE.REST,
      });
    }
  }

  // 開始時刻でソート
  dailyActualWorkingPeriodList.sort((a, b) => a.startTime - b.startTime);

  return dailyActualWorkingPeriodList;
};
