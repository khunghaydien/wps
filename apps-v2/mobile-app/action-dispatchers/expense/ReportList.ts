import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as reportListActions } from '../../modules/expense/entities/reportList';

export const getReportList =
  (
    empId: string,
    reportIds: string[],
    loadInBackground: boolean,
    noOfReport?: number,
    isRefresh?: boolean,
    isRequest?: boolean,
    empHistoryIds?: Array<string>
  ) =>
  (dispatch: AppDispatch) => {
    return loadInBackground
      ? dispatch(
          reportListActions.list(
            empId,
            reportIds,
            noOfReport,
            isRefresh,
            isRequest,
            empHistoryIds
          )
        ).catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        })
      : dispatch(
          withLoading(
            reportListActions.list(
              empId,
              reportIds,
              noOfReport,
              isRefresh,
              isRequest,
              empHistoryIds
            )
          )
        ).catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        });
  };

export const clearReportList = () => (dispatch: AppDispatch) => {
  dispatch(reportListActions.clear());
};

export const deleteReport = (reportId: string) => (dispatch: AppDispatch) =>
  dispatch(withLoading(reportListActions.delete(reportId)));
