import { withLoading } from '../../modules/commons/loading';
import { showToast } from '@commons/modules/toast';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as ccTransactionActions } from '../../modules/expense/entities/ccTransactions';

export const getCCTransactions =
  (companyId: string, empId: string, from: string, to: string) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(ccTransactionActions.get(companyId, empId, from, to))
    ).catch((err) => {
      dispatch(showToast(err.message || err.event.message));
    });
