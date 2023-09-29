import { withLoading } from '../../modules/commons/loading';
import { showToast } from '@commons/modules/toast';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as icCardActions } from '../../modules/expense/entities/icCard';
import { actions as icTransactionActions } from '../../modules/expense/entities/icTransactions';

export const getICCardList =
  (
    salesId: string,
    customerId: string,
    companyId: string,
    employeeCode: string
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        icCardActions.get(salesId, customerId, companyId, employeeCode)
      )
    ).catch((err) => {
      dispatch(showToast(err.message || err.event.message));
    });

export const getICTransactions =
  (
    salesId: string,
    customerId: string,
    companyId: string,
    employeeCode: string,
    paymentDateFrom?: string,
    paymentDateTo?: string
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        icTransactionActions.get(
          salesId,
          customerId,
          companyId,
          employeeCode,
          paymentDateFrom,
          paymentDateTo
        )
      )
    ).catch((err) => {
      dispatch(showToast(err.message || err.event.message));
    });
