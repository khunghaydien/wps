/**
 * 勤務時間が入力可能かどうかを返します
 * @param {*} param.isLocked - Timesheet.isLocked
 * @param {*} param.startTime - Timesheet.recordsByRecordDate.{date}.startTime
 * @param {*} param.endTime - Timesheet.recordsByRecordDate.{date}.endTime
 * @param {*} requiredInput - requiredInput
 */
export default ({
  lockedTimesheet,
  lockedDailyRecord,
  startTime,
  endTime,
  requiredInput,
}: {
  lockedTimesheet: boolean;
  lockedDailyRecord: boolean;
  startTime: number | null;
  endTime: number | null;
  requiredInput: boolean;
}) => {
  // Timesheet がロックされていたら操作不可とする
  if (lockedDailyRecord || lockedTimesheet) {
    return false;
  }
  // 勤務時刻をクリアするため、実労働時間を持つ場合は日タイプに関わらず操作可能とする
  if (startTime !== null || endTime !== null) {
    return true;
  }
  return requiredInput;
};
