import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { clientSearchQuery } from '@apps/domain/models/psa/Client';

import { actions as ClientActions } from '@apps/psa-pc/modules/entities/clientInfo/client';

import { AppDispatch } from './AppThunk';

export const getClientList =
  (param: clientSearchQuery) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(ClientActions.getClientList(param))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
