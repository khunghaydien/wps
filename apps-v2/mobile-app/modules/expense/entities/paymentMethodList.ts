import {
  PaymentMethod,
  searchPaymentMethodList,
} from '@apps/domain/models/exp/PaymentMethod';

import { AppDispatch } from '../AppThunk';

/** stores active payment methods of the selected report type */

type Search = {
  type: typeof ACTIONS.SEARCH;
  payload: PaymentMethod[];
};

export const ACTIONS = {
  SEARCH: 'MODULES/EXPENSE/ENTITIES/PAYMENT_METHOD/SEARCH',
};

export const actions = {
  search:
    (ids: string[], companyId: string, active?: boolean) =>
    (dispatch: AppDispatch): Promise<PaymentMethod[]> =>
      searchPaymentMethodList(ids, companyId, active).then(({ records }) => {
        dispatch({
          type: ACTIONS.SEARCH,
          payload: records || [],
        });
        return records || [];
      }),
};

const initialState = [];

export default (state = initialState, action: Search): PaymentMethod[] => {
  switch (action.type) {
    case ACTIONS.SEARCH:
      return action.payload;
    default:
      return state;
  }
};
