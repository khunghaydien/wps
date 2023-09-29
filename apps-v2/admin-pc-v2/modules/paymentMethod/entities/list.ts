import { PaymentMethod } from '@apps/domain/models/exp/PaymentMethod';

import {
  CREATE_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  SEARCH_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD,
} from '@admin-pc-v2/actions/paymentMethod';

const initialState = [];

export default (state = initialState, action): Array<PaymentMethod> => {
  switch (action.type) {
    case SEARCH_PAYMENT_METHOD:
      return action.payload;
    case CREATE_PAYMENT_METHOD:
    case DELETE_PAYMENT_METHOD:
    case UPDATE_PAYMENT_METHOD:
    default:
      return state;
  }
};
