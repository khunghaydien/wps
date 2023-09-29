import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as reportIdListActions } from '../../modules/expense/entities/reportIdList';

export const getReportIdList =
  (
    isApproved: boolean,
    empId: string,
    isBackgroundLoading?: boolean,
    isRequest?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    return isBackgroundLoading
      ? dispatch(
          reportIdListActions.listIds(isApproved, empId, isRequest)
        ).catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        })
      : dispatch(
          withLoading(reportIdListActions.listIds(isApproved, empId, isRequest))
        ).catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
  };

export const clearReportIdList = () => (dispatch: AppDispatch) =>
  dispatch(reportIdListActions.clear());
