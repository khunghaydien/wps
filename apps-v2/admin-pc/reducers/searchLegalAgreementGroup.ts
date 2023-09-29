import { SEARCH_LEGAL_AGREEMENT_GROUP } from '../actions/attLegalAgreementGroup';

const initialState = [];

export default function searchLegalAgreementGroupReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_LEGAL_AGREEMENT_GROUP:
      return action.payload;
    default:
      return state;
  }
}
