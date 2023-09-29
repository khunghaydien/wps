import { SEARCH_TALENT_PROFILE } from '../actions/talentProfile';

const initialState = [];

export default function searchTalentProfileReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_TALENT_PROFILE:
      return action.payload;
    default:
      return state;
  }
}
