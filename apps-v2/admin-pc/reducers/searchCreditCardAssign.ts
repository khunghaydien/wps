import { CardAssign } from '@apps/domain/models/exp/CreditCard';

import { SEARCH_CREDIT_CARD_ASSIGNMENT } from '@apps/admin-pc/actions/creditCardAssign';

type State = CardAssign[];

const initialState: State = [];

export default function searchCreditCardAssignReducer(
  state = initialState,
  action
): State {
  switch (action.type) {
    case SEARCH_CREDIT_CARD_ASSIGNMENT:
      return action.payload;
    default:
      return state;
  }
}
