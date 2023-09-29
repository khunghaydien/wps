import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { OpportunitySearchQuery } from '@apps/domain/models/psa/Opportunity';

import { actions as opportunityActions } from '@apps/psa-pc/modules/entities/clientInfo/opportunity';

import { AppDispatch } from './AppThunk';

export const getOpportunityList =
  (param: OpportunitySearchQuery) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(opportunityActions.getOpportunityList(param))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
