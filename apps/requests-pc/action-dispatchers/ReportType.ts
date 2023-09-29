import { Dispatch } from 'redux';

import moment from 'moment';

import expModuleType from '../../commons/constants/expModuleType';

import {
  catchApiError,
  CatchApiErrorAction,
  CatchUnexpectedErrorAction,
} from '../../commons/actions/app';

import {
  ExpenseReportType,
  getReportTypeList as fetchReportType,
} from '../../domain/models/exp/expense-report-type/list';
import { Report } from '../../domain/models/exp/Report';

/**
 * Get report type with linked expense types
 * use the first date of three months prior than current schedule date's month
 * e.g. record date '2020-03-22' converts to start date '2019-12-01'
 *
 * @param {Report} report
 * @param {String} companyId
 * @returns {Promise<ExpenseReportType>}
 */
export const getReportTypeWithLinkedExpType =
  (report: Report, companyId: string) =>
  (
    dispatch: Dispatch
  ): Promise<
    CatchApiErrorAction | CatchUnexpectedErrorAction | ExpenseReportType
  > => {
    const { scheduledDate, expReportTypeId } = report;
    const startDate = moment(scheduledDate)
      .add(-3, 'months')
      .startOf('months')
      .format('YYYY-MM-DD');

    return fetchReportType(
      companyId,
      expModuleType.REQUEST,
      true,
      null,
      false,
      startDate,
      null,
      true,
      expReportTypeId
    )
      .then(
        (res: { records: Array<ExpenseReportType> }) =>
          res.records[0] || ({} as ExpenseReportType)
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export default getReportTypeWithLinkedExpType;
