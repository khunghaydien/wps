import { catchApiError } from '@mobile/modules/commons/error';
import { withLoading } from '@mobile/modules/commons/loading';

import { ExpRequest } from '@apps/domain/models/exp/request/Report';

import { actions as preRequestActions } from '@mobile/modules/approval/entities/expense/preRequest';
import { actions as expRequestActions } from '@mobile/modules/approval/entities/expense/report';

import { AppDispatch } from '../AppThunk';

export const getExpRequest =
  (requestId: string, isExpense: boolean) => (dispatch: AppDispatch) => {
    const action = isExpense ? expRequestActions : preRequestActions;
    return dispatch(withLoading(action.get(requestId)))
      .then((res: Array<ExpRequest>) => {
        const report = res[0];
        return report;
      })
      .catch((err) => {
        dispatch(catchApiError(err));
        throw err;
      });
  };

export const clearReportState =
  (isExpense: boolean) => (dispatch: AppDispatch) => {
    const action = isExpense ? expRequestActions : preRequestActions;
    return dispatch(action.clear());
  };
