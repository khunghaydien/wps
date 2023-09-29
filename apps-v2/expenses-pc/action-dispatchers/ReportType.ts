import find from 'lodash/find';
import moment from 'moment';

import expModuleType from '../../commons/constants/expModuleType';

import {
  catchApiError,
  CatchApiErrorAction,
  CatchUnexpectedErrorAction,
} from '../../commons/actions/app';

import { AccountingPeriodList } from '../../domain/models/exp/AccountingPeriod';
import {
  ExpenseReportType,
  getReportTypeList as fetchReportType,
} from '../../domain/models/exp/expense-report-type/list';
import { Report } from '../../domain/models/exp/Report';

import { AppDispatch } from '../modules/AppThunk';

/**
 * Get report type with linked expense types
 * if accounting period exits, use the start/end date from accounting period
 * otherwise use the first date of three months prior than current record date's month
 * e.g. record date '2020-03-22' converts to start date '2019-12-01'
 *
 * @param {Report} report
 * @param {AccountingPeriodList} accountingPeriods
 * @param {String} companyId
 * @returns {Promise<ExpenseReportType>}
 */
export const getReportTypeWithLinkedExpType =
  (
    report: Report,
    accountingPeriods: AccountingPeriodList,
    companyId: string,
    empHistoryId?: string,
    empId?: string
  ) =>
  (
    dispatch: AppDispatch
  ): Promise<
    CatchApiErrorAction | CatchUnexpectedErrorAction | ExpenseReportType
  > => {
    const { accountingDate, expReportTypeId, accountingPeriodId } = report;
    let startDate = moment(accountingDate)
      .add(-3, 'months')
      .startOf('months')
      .format('YYYY-MM-DD');
    let endDate = null;
    if (accountingPeriodId) {
      const curAP = find(accountingPeriods, ['id', accountingPeriodId]) || {};
      startDate = (curAP as any).validDateFrom;
      endDate = (curAP as any).validDateTo;
    }
    return fetchReportType(
      companyId,
      expModuleType.REPORT,
      true,
      empId,
      false,
      startDate,
      endDate,
      true,
      expReportTypeId,
      empHistoryId
    )
      .then(
        (res: { records: Array<ExpenseReportType> }) =>
          res.records[0] || ({} as ExpenseReportType)
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export default getReportTypeWithLinkedExpType;
