import * as constants from './constants';

import * as actions from './actions';

type State = {
  isOpen: boolean;
};

const initialState: State = {
  isOpen: false,
};

export default (state = initialState, action): State => {
  switch (action.type) {
    case constants.OPEN:
      return Object.assign({}, state, { isOpen: true });
    case constants.CLOSE:
      return Object.assign({}, state, { isOpen: false });
    default:
      return state;
  }
};

export { constants, actions };
