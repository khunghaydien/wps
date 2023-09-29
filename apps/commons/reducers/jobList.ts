import { CLEAR_JOB_LIST, FETCH_JOB_LIST } from '../actions/jobList';

const initialState = [];

export default function jobListReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_JOB_LIST:
      return action.payload;
    case CLEAR_JOB_LIST:
      return initialState;

    default:
      return state;
  }
}
