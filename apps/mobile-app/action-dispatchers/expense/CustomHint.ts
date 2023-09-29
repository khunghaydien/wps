import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as customHintActions } from '../../modules/expense/entities/customHint';

/* eslint-disable import/prefer-default-export */
export const getCustomHints = (companyId: string) => (dispatch: AppDispatch) =>
  dispatch(withLoading(customHintActions.get(companyId)));
