import { withLoading } from '../../modules/commons/loading';
import { showToast } from '@commons/modules/toast';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as ccTransactionActions } from '../../modules/expense/entities/ccTransactions';

export const getCCTransactions =
  (
    companyId: string,
    empId: string,
    from: string,
    to: string,
    reimbursement?: boolean,
    cardNameList?: Array<string>,
    description?: string,
    includeHidden?: boolean,
    includeClaimed?: boolean
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        ccTransactionActions.get(
          companyId,
          empId,
          from,
          to,
          reimbursement,
          cardNameList,
          description,
          includeHidden,
          includeClaimed
        )
      )
    )
      .then((res) => res[0]?.payload)
      .catch((err) => {
        dispatch(showToast(err.message || err.event.message));
      });
