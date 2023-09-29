import UrlUtil from '../../../commons/utils/UrlUtil';

/**
 * @param {String} periodStartDate The start date of target month
 * @param {String} closingDate The end date of target month
 * @param {String} [targetEmployeeId=null] The ID of target employee
 */
export const openAllowanceWindow =
  (
    periodStartDate: string,
    closingDate: string,
    targetEmployeeId: null | string = null
  ) =>
  () => {
    const param = targetEmployeeId
      ? {
          startDate: periodStartDate,
          endDate: closingDate,
          targetEmployeeId,
        }
      : {
          startDate: periodStartDate,
          endDate: closingDate,
        };
    UrlUtil.openApp('timesheet-pc-allowance', param);
  };

export const OpenObjectivelyEventLogWindow =
  (
    periodStartDate: string,
    closingDate: string,
    targetEmployeeId: null | string = null
  ) =>
  () => {
    const param = targetEmployeeId
      ? {
          startDate: periodStartDate,
          endDate: closingDate,
          targetEmployeeId,
        }
      : {
          startDate: periodStartDate,
          endDate: closingDate,
        };
    UrlUtil.openApp('timesheet-pc-objectively-event-log', param);
  };

export const openRestReasonWindow =
  (
    periodStartDate: string,
    closingDate: string,
    targetEmployeeId: null | string = null
  ) =>
  () => {
    const param = targetEmployeeId
      ? {
          startDate: periodStartDate,
          endDate: closingDate,
          targetEmployeeId,
        }
      : {
          startDate: periodStartDate,
          endDate: closingDate,
        };
    UrlUtil.openApp('timesheet-pc-restreason', param);
  };
