import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import { getUserSetting } from '../../commons/actions/userSetting';
import UrlUtil from '../../commons/utils/UrlUtil';

import { actions as expenseReportTypeActions } from '../../domain/modules/exp/expense-report-type/list';
import { actions as reportActions } from '../../domain/modules/exp/report';
import { AppDispatch } from '../modules/AppThunk';

export const openPrintDialog = () => () => {
  window.print();
};

export const initialize = () => (dispatch: AppDispatch) => {
  const params = UrlUtil.getUrlQuery();
  const reportId = params && params.reportId;
  dispatch(loadingStart());

  return Promise.all([
    dispatch(reportActions.get(reportId)).then((res) => {
      const empId = res.payload.employeeBaseId;
      return dispatch(
        getUserSetting({ detailSelectors: ['DEPARTMENT'], empId })
      ); /* Only Retreive the basic information and Department details. */
    }),
    dispatch(expenseReportTypeActions.list(undefined, 'REPORT')),
  ])
    .catch((err) => dispatch(catchApiError(err, { isContinuable: false })))
    .then(() => dispatch(loadingEnd()));
};
