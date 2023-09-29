import { SEARCH_JOB_GRADE } from '../actions/jobGrade';

const initialState = [];

export default function searchJobGradeReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_JOB_GRADE:
      return action.payload;
    default:
      return state;
  }
}
