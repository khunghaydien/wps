import { SEARCH_SKILLSET } from '../actions/skillset';

const initialState = [];

export default function searchSkillsetReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_SKILLSET:
      return action.payload;
    default:
      return state;
  }
}
