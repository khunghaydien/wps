import { Reducer } from 'redux';

import { RecordUpdated } from '../../../../../../commons/components/exp/Form/Dialog/RecordUpdatedInfo';

export const ACTIONS = {
  SET_UPDATE_INFO: 'MODULES/EXPENSES/DIALOG/RECORD_UPDATED/SET_UPDATE_INFOS',
};

export const actions = {
  setCloneUpdate: (updateInfo: Record<string, any>) => ({
    type: ACTIONS.SET_UPDATE_INFO,
    payload: updateInfo,
  }),
};

//
// Reducer
//
const initialState: RecordUpdated = {
  updateInfo: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_UPDATE_INFO:
      return { updateInfo: [...action.payload] };
    default:
      return state;
  }
}) as Reducer<any, any>;
