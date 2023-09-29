import { GET_PSA_BATCH_JOB } from '../actions/psaBatchJob';

const initialState = {};

export default function getPsaBatchJobReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PSA_BATCH_JOB:
      return action.payload;
    default:
      return state;
  }
}
