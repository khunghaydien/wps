import get from 'lodash/get';
import moment from 'moment';

import expModuleType from '../../../commons/constants/expModuleType';

import DateUtil from '../../../commons/utils/DateUtil';
import { catchApiError } from '../../modules/commons/error';
import {
  endLoading,
  startLoading,
  withLoading,
} from '../../modules/commons/loading';

import { AccountingPeriodOption } from '../../../domain/models/exp/AccountingPeriod';
import {
  ExpenseReportType,
  getReportTypeList as fetchReportType,
} from '../../../domain/models/exp/expense-report-type/list';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as expReportTypeActions } from '../../modules/expense/entities/expReportType';
import { actions as selectedReportTypeActions } from '../../modules/expense/entities/selectedReportType';

export const getExpReportTypeList =
  (
    empGroupId: string,
    companyId: string,
    active?: boolean,
    employeeId?: string,
    withExpTypeName?: boolean,
    startDate?: string,
    endDate?: string,
    includeLinkedExpenseTypeIds?: boolean,
    reportTypeId?: string,
    isRequest?: boolean
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        expReportTypeActions.list(
          empGroupId,
          companyId,
          active,
          employeeId,
          withExpTypeName,
          startDate,
          endDate,
          includeLinkedExpenseTypeIds,
          reportTypeId,
          isRequest
        )
      )
    );

/**
 * Get report type corresponding to given id and set into redux
 *
 * @param {string} companyId
 * @param {string} reportTypeId
 * @param {boolean} includeLinkedExpenseTypeIds
 * @returns {Promise<void>}
 */
export const getSelectedExpReportType =
  (
    companyId: string,
    reportTypeId: string,
    includeLinkedExpenseTypeIds?: boolean,
    noLoading?: boolean
  ) =>
  (dispatch: AppDispatch): Promise<void> => {
    const action = selectedReportTypeActions.get(
      companyId,
      reportTypeId,
      includeLinkedExpenseTypeIds
    );
    return noLoading ? dispatch(action) : dispatch(withLoading(action));
  };

/**
 * Get linked expense type via report type search by Id
 * if accounting period exits, use the start/end date from accounting period
 * otherwise use the first date of three months prior than current record date's month
 * e.g. record date '2020-03-22' converts to start date '2019-12-01'
 *
 * @param {String} reportTypeId
 * @param {?string} recordDate
 * @param {?AccountingPeriodOption} accountingPeriod
 * @param {String} companyId
 * @param {boolean} [withExpTypeName]
 * @returns {Promise<ExpenseReportType>}
 */
export const getReportTypeLinkedExpType =
  (
    reportTypeId: string,
    recordDate: string,
    accountingPeriod: AccountingPeriodOption,
    companyId: string,
    withExpTypeName?: boolean
  ) =>
  (dispatch: AppDispatch): Promise<ExpenseReportType> => {
    let startDate = moment(recordDate)
      .add(-3, 'months')
      .startOf('months')
      .format('YYYY-MM-DD');
    let endDate = null;
    const label = get(accountingPeriod, 'label');
    if (label) {
      const dates = label.split(' - ');
      startDate = DateUtil.format(dates[0], 'YYYY-MM-DD');
      endDate = DateUtil.format(dates[1], 'YYYY-MM-DD');
    }
    const loadingId = dispatch(startLoading());
    return fetchReportType(
      companyId,
      expModuleType.REPORT,
      true,
      null,
      withExpTypeName,
      startDate,
      endDate,
      true,
      reportTypeId
    )
      .then((res: { records: Array<ExpenseReportType> }) => {
        return res.records[0];
      })
      .catch((err) => {
        dispatch(catchApiError(err));
        throw err;
      })
      .finally(() => dispatch(endLoading(loadingId)));
  };
