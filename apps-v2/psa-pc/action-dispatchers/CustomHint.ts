import { withLoading } from '@apps/commons/actions/app';

import { actions as customHintActions } from '@psa/modules/entities/customHint';

import { AppDispatch } from './AppThunk';

/* eslint-disable import/prefer-default-export */
export const getCustomHints = (companyId: string) => (dispatch: AppDispatch) =>
  dispatch(withLoading(customHintActions.get(companyId)));
