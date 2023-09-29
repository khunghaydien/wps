import { SEARCH_PSA_WORK_SCHEME } from '../actions/psaWorkScheme';

const initialState = [];

export default function searchPsaWorkSchemeReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_PSA_WORK_SCHEME:
      return action.payload;
    default:
      return state;
  }
}
