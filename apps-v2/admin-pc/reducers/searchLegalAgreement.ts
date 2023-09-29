import { SEARCH_LEGAL_AGREEMENT } from '../actions/legalAgreement';

const initialState = [];

export default function searchLegalAgreementReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_LEGAL_AGREEMENT:
      return action.payload;
    default:
      return state;
  }
}
