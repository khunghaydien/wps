import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as accountingPeriodActions } from '../../modules/expense/entities/accountingPeriod';

/* eslint-disable import/prefer-default-export */
export const getAccountingPeriodList =
  (companyId: string) => (dispatch: AppDispatch) =>
    dispatch(withLoading(accountingPeriodActions.list(companyId)));
