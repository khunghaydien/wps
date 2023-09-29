import _ from 'lodash';

import { DIALOG_HIDE, DIALOG_SHOW } from '../../constants/dialog';

import { Z_INDEX_DEFAULT } from '../../components/dialogs/DialogFrame';

const getNextZIndex = (state) => {
  if (Object.keys(state).length === 0) {
    return Z_INDEX_DEFAULT;
  }

  return _.max(_.values(state)) + 2;
};

export default function dialogstReducer(state = {}, action) {
  switch (action.type) {
    case DIALOG_SHOW:
      if (Object.keys(state).includes(action.type)) {
        return state;
      }

      const zIndex = getNextZIndex(state);
      return Object.assign({}, state, { [action.payload]: zIndex });
    case DIALOG_HIDE:
      delete state[action.payload];
      return Object.assign({}, state);
    default:
      return state;
  }
}
