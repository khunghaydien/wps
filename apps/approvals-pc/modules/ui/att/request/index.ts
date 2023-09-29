import * as detailConstants from '../../../entities/att/detail/constants';
import * as constants from './constants';

// Reducer
const initialState = {
  comment: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.EDIT_COMMENT:
      return Object.assign({}, state, { comment: action.payload });
    case constants.APPROVE_SUCCESS:
    case constants.REJECT_SUCCESS:
    case detailConstants.FETCH_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
