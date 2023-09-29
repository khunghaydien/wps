import { withLoading } from '@mobile/modules/commons/loading';

import { AppDispatch } from '@mobile/modules/expense/AppThunk';
import { getEmpHistoryList } from '@mobile/modules/expense/entities/empHistoryList';

/**
 * get employee history list
 *
 * @param {string} empId
 */
export const getEmpHistory = (empId: string) => (dispatch: AppDispatch) =>
  dispatch(withLoading(getEmpHistoryList(empId)));
