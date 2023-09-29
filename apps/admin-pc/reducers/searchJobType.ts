import { SEARCH_JOB_TYPE } from '../actions/jobType';

const initialState = [];

export default function searchJobTypeReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_JOB_TYPE:
      return action.payload;
    default:
      return state;
  }
}
