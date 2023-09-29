import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';
import {
  AttDailyRequest,
  isStatusChangeWorkingRule,
  STATUS as DAILY_REQUEST_STATUS,
} from '@attendance/domain/models/AttDailyRequest';
import { CODE as REQUEST_TYPE_CODE } from '@attendance/domain/models/AttDailyRequestType';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';
/**
 * 勤怠時間を入力するすべきかどうかを返します。
 * @param {*} param.recordDate - Timesheet.recordsByRecordDate.{date}.recordDate
 * @param {*} param.dayType - Timesheet.recordsByRecordDate.{date}.dayType
 * @param {*} param.isLeaveOfAbsence - Timesheet.recordsByRecordDate.{date}.isLeaveOfAbsence
 * @param {*} requests
 */
export default ({
  recordDate,
  dayType,
  isLeaveOfAbsence,
  requests,
}: {
  recordDate: string;
  dayType: DayType;
  isLeaveOfAbsence: boolean;
  requests: AttDailyRequest[];
}): boolean => {
  // 休職・休業期間中の場合は、時刻操作を操作不可とする
  if (isLeaveOfAbsence) {
    // - 欠勤申請の場合は、時刻操作を操作不可とする
    const absenceResult = requests.some(
      (request) =>
        request.requestTypeCode === REQUEST_TYPE_CODE.Absence &&
        isStatusChangeWorkingRule(request.status)
    );

    if (absenceResult) {
      return false;
    }

    // 全日の休暇申請の場合は、時刻操作を操作不可とする
    const allDayLeaveResult = requests.some(
      (request) =>
        request.requestTypeCode === REQUEST_TYPE_CODE.Leave &&
        isStatusChangeWorkingRule(request.status) &&
        request.leaveRange === LEAVE_RANGE.Day
    );
    if (allDayLeaveResult) {
      return false;
    }

    // 勤務パターン変更申請が出ていた場合は操作を許可する
    let result = requests.some(
      (request) =>
        request.requestTypeCode === REQUEST_TYPE_CODE.Pattern &&
        request.status === DAILY_REQUEST_STATUS.APPROVED
    );

    // ただし、休日出勤申請をした後に休暇申請をしていた場合は時刻操作を不可にする。
    requests.forEach((request) => {
      if (
        request.requestTypeCode === REQUEST_TYPE_CODE.Leave &&
        isStatusChangeWorkingRule(request.status) &&
        request.leaveRange === LEAVE_RANGE.Day
      ) {
        result = false;
      }
    });

    return result;
  }

  let result = false;
  switch (dayType) {
    case DAY_TYPE.Workday: {
      // 勤務日は、通常は時刻操作可能
      result = true;
      // 振替勤務(承認済み)があるか
      let isExistApprovedHolidayWork = false;
      // 勤務日変更の場合(勤務日⇒休日)があるか
      let isExistPatternWorkdayToHoliday = false;

      // ただし、以下の申請が承認待ちもしくは承認済みの場合は時刻操作を不可とする
      // ※却下・申請取消・承認取消であれば時刻操作可能
      // - 全日の休暇申請
      // - 振替休日ありの休日出勤申請（振替休日日）
      // - 欠勤申請
      // - 勤務日変更の場合(勤務日⇒休日)かつ、振替勤務(承認済み)がなし
      requests.forEach((request) => {
        switch (request.requestTypeCode) {
          case REQUEST_TYPE_CODE.Leave:
            if (
              isStatusChangeWorkingRule(request.status) &&
              request.leaveRange === LEAVE_RANGE.Day
            ) {
              result = false;
            }
            break;
          case REQUEST_TYPE_CODE.HolidayWork:
            if (
              isStatusChangeWorkingRule(request.status) &&
              request.substituteDate === recordDate
            ) {
              result = false;
            }

            if (
              request.requestTypeCode === REQUEST_TYPE_CODE.HolidayWork &&
              request.status === DAILY_REQUEST_STATUS.APPROVED &&
              request.startDate === recordDate
            ) {
              isExistApprovedHolidayWork = true;
            }
            break;

          case REQUEST_TYPE_CODE.Absence:
            if (isStatusChangeWorkingRule(request.status)) {
              result = false;
            }

            break;

          case REQUEST_TYPE_CODE.Direct: {
            if (request.status === DAILY_REQUEST_STATUS.APPROVAL_IN) {
              result = false;
            }
            break;
          }

          case REQUEST_TYPE_CODE.Pattern:
            if (
              isStatusChangeWorkingRule(request.status) &&
              request.requestDayType === DAY_TYPE.Holiday
            ) {
              isExistPatternWorkdayToHoliday = true;
            }
            break;
          default:
        }
      });

      if (isExistPatternWorkdayToHoliday && !isExistApprovedHolidayWork) {
        result = false;
      }
      break;
    }

    case DAY_TYPE.Holiday:
    case DAY_TYPE.PreferredLegalHoliday:
    case DAY_TYPE.LegalHoliday: {
      // 休日は、通常は時刻操作不可
      result = false;

      // ただし、有効な休日出勤申請があり、かつ振替元である場合は、時刻操作を可能とする
      requests.forEach((request) => {
        if (
          request.requestTypeCode === REQUEST_TYPE_CODE.HolidayWork &&
          request.status === DAILY_REQUEST_STATUS.APPROVED &&
          request.startDate === recordDate
        ) {
          result = true;
        }
      });
      // ただし、休日出勤申請をした後に休暇申請をしていた場合は時刻操作を不可にする。
      requests.forEach((request) => {
        if (
          request.requestTypeCode === REQUEST_TYPE_CODE.Leave &&
          isStatusChangeWorkingRule(request.status) &&
          request.leaveRange === LEAVE_RANGE.Day
        ) {
          result = false;
        }
      });
      break;
    }

    default:
  }
  return result;
};
